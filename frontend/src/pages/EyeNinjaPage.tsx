import React, { useEffect, useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

// --- Game Settings ---
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.035; // Slow float gravity
const HOVER_TRIGGER_FRAMES = 1; // Instant slash on hover!

interface NinjaTarget {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'bacteria' | 'dust' | 'eye-drop' | 'bomb';
  sliced: boolean;
  sliceAngle: number;
  slicePartL: { x: number; y: number; vx: number; vy: number };
  slicePartR: { x: number; y: number; vx: number; vy: number };
  hoverProgress: number;
}

interface SlashEffect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  life: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
}

export default function EyeNinjaPage() {
  const { t, tArray, language } = useLanguage();
  const navigate = useNavigate();

  // Refs
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // States
  const [playMode, setPlayMode] = useState<'camera' | 'mouse' | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('vista-ninja-highscore') || '0');
  });

  // Reticle Tracking Coordinates
  const [reticlePos, setReticlePos] = useState({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
  const [sensitivity, setSensitivity] = useState(6.0); // Higher sensitivity for iris movements
  const calibratedCenterRef = useRef<{ x: number; y: number } | null>(null);

  // Game references
  const targetIdCounter = useRef(0);
  const gameRef = useRef({
    reticleX: CANVAS_WIDTH / 2,
    reticleY: CANVAS_HEIGHT / 2,
    targets: [] as NinjaTarget[],
    slashes: [] as SlashEffect[],
    particles: [] as Particle[],
    score: 0,
    frameCount: 0,
    currentTip: '',
    spawnInterval: 140, // More time between targets
    screenShake: 0,
  });

  const eyeTips = tArray('eyeNinjaGame.tips');
  const getNextTip = useCallback(() => {
    if (eyeTips && eyeTips.length > 0) {
      const idx = Math.floor(Math.random() * eyeTips.length);
      gameRef.current.currentTip = eyeTips[idx];
    } else {
      gameRef.current.currentTip = "Liếc mắt theo các góc giúp thư giãn cơ vận nhãn!";
    }
  }, [eyeTips]);

  // Load FaceLandmarker Model
  const startCameraMode = async () => {
    setPlayMode('camera');
    if (faceLandmarker) return;

    setModelLoading(true);
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
      );
      const detector = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      setFaceLandmarker(detector);
    } catch (e) {
      console.error('Failed to load FaceLandmarker', e);
      alert('Không thể kết nối Camera AI. Đang chuyển sang chế độ chơi bằng chuột.');
      setPlayMode('mouse');
    } finally {
      setModelLoading(false);
    }
  };

  // Calibration Function
  const calibrateCenter = () => {
    calibratedCenterRef.current = null;
  };

  // Webcam Tracking Loop with Iris / Pupil Detection
  useEffect(() => {
    if (!faceLandmarker || playMode !== 'camera') return;

    let active = true;
    let lastVideoTime = -1;

    const runDetection = () => {
      if (!active) return;

      const video = webcamRef.current?.video;
      if (video && video.readyState === 4) {
        const timestamp = performance.now();
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          try {
            const results = faceLandmarker.detectForVideo(video, timestamp);
            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
              setFaceDetected(true);
              const landmarks = results.faceLandmarks[0];

              // Pure Eye Gaze (Iris tracking):
              // Left Eye: corners (33, 133), pupil (468)
              // Right Eye: corners (362, 263), pupil (473)
              if (landmarks[468] && landmarks[473]) {
                const leftCenter = (landmarks[33].x + landmarks[133].x) / 2;
                const leftWidth = Math.abs(landmarks[33].x - landmarks[133].x);
                const leftGazeX = (landmarks[468].x - leftCenter) / leftWidth;

                const rightCenter = (landmarks[362].x + landmarks[263].x) / 2;
                const rightWidth = Math.abs(landmarks[362].x - landmarks[263].x);
                const rightGazeX = (landmarks[473].x - rightCenter) / rightWidth;

                // Vertical relative offsets
                const leftCenterY = (landmarks[159].y + landmarks[145].y) / 2;
                const leftHeight = Math.abs(landmarks[159].y - landmarks[145].y);
                const leftGazeY = (landmarks[468].y - leftCenterY) / leftHeight;

                const rightCenterY = (landmarks[386].y + landmarks[374].y) / 2;
                const rightHeight = Math.abs(landmarks[386].y - landmarks[374].y);
                const rightGazeY = (landmarks[473].y - rightCenterY) / rightHeight;

                const avgGazeX = (leftGazeX + rightGazeX) / 2;
                const avgGazeY = (leftGazeY + rightGazeY) / 2;

                if (!calibratedCenterRef.current) {
                  calibratedCenterRef.current = { x: avgGazeX, y: avgGazeY };
                }

                const dx = avgGazeX - calibratedCenterRef.current.x;
                const dy = avgGazeY - calibratedCenterRef.current.y;

                // Translate small pupil offset into full screen coordinate
                // dx is positive when looking left (camera mirror), so X moves left. We adjust signs:
                let targetX = CANVAS_WIDTH / 2 - dx * CANVAS_WIDTH * sensitivity;
                let targetY = CANVAS_HEIGHT / 2 + dy * CANVAS_HEIGHT * (sensitivity * 1.5);

                // Clamp to canvas borders
                targetX = Math.max(30, Math.min(CANVAS_WIDTH - 30, targetX));
                targetY = Math.max(30, Math.min(CANVAS_HEIGHT - 30, targetY));

                // Smooth reticle movement
                gameRef.current.reticleX += (targetX - gameRef.current.reticleX) * 0.18;
                gameRef.current.reticleY += (targetY - gameRef.current.reticleY) * 0.18;

                setReticlePos({
                  x: gameRef.current.reticleX,
                  y: gameRef.current.reticleY
                });
              }
            } else {
              setFaceDetected(false);
            }
          } catch (e) {
            console.error('Iris gaze tracking error', e);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(runDetection);
    };

    runDetection();

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [faceLandmarker, playMode, sensitivity]);

  // Mouse fallback
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (playMode !== 'mouse' || gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    const mouseY = ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;

    gameRef.current.reticleX = mouseX;
    gameRef.current.reticleY = mouseY;
    setReticlePos({ x: mouseX, y: mouseY });
  };

  // Start game
  const startGame = () => {
    getNextTip();
    gameRef.current = {
      reticleX: CANVAS_WIDTH / 2,
      reticleY: CANVAS_HEIGHT / 2,
      targets: [],
      slashes: [],
      particles: [],
      score: 0,
      frameCount: 0,
      currentTip: gameRef.current.currentTip,
      spawnInterval: 140,
      screenShake: 0,
    };
    setScore(0);
    setGameState('playing');
  };

  // Game over
  const endGame = () => {
    setGameState('gameover');
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    const finalScore = gameRef.current.score;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('vista-ninja-highscore', String(finalScore));
    }
  };

  // Game loop updates
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const spawnTarget = () => {
      const state = gameRef.current;
      targetIdCounter.current++;

      // Spawning spots: bottom corners or sides to force eye rotation!
      const side = Math.random() < 0.5 ? 'left' : 'right';
      const x = side === 'left' ? 60 : CANVAS_WIDTH - 60;
      const y = CANVAS_HEIGHT;

      // Slower, floaty trajectories for comfortable gaze tracking
      const vx = side === 'left' ? (0.8 + Math.random() * 1.5) : (-0.8 - Math.random() * 1.5);
      const vy = -3.5 - Math.random() * 1.5;

      const rand = Math.random();
      let type: 'bacteria' | 'dust' | 'eye-drop' | 'bomb' = 'bacteria';
      let radius = 28;

      if (rand < 0.12) {
        type = 'bomb';
        radius = 32;
      } else if (rand < 0.32) {
        type = 'eye-drop';
        radius = 24;
      } else if (rand < 0.60) {
        type = 'dust';
        radius = 28;
      }

      state.targets.push({
        id: targetIdCounter.current,
        x,
        y,
        vx,
        vy,
        radius,
        type,
        sliced: false,
        sliceAngle: 0,
        slicePartL: { x: 0, y: 0, vx: 0, vy: 0 },
        slicePartR: { x: 0, y: 0, vx: 0, vy: 0 },
        hoverProgress: 0,
      });
    };

    const updateGame = () => {
      if (!active) return;

      const state = gameRef.current;
      state.frameCount++;

      if (state.screenShake > 0) state.screenShake -= 0.8;

      if (state.frameCount % state.spawnInterval === 0 || state.targets.length === 0) {
        spawnTarget();
      }

      for (let i = state.targets.length - 1; i >= 0; i--) {
        const t = state.targets[i];

        if (!t.sliced) {
          // Slow float physics
          t.vy += GRAVITY;
          t.x += t.vx;
          t.y += t.vy;

          const dx = state.reticleX - t.x;
          const dy = state.reticleY - t.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Forgiving slash boundaries
          if (dist < t.radius + 18) {
            t.hoverProgress++;

            // Instant Slash on Gaze Hover!
            if (t.hoverProgress >= HOVER_TRIGGER_FRAMES) {
              t.sliced = true;
              t.sliceAngle = Math.atan2(dy, dx) + Math.PI / 2;

              t.slicePartL = { x: t.x, y: t.y, vx: t.vx - 1.8, vy: t.vy - 1.0 };
              t.slicePartR = { x: t.x, y: t.y, vx: t.vx + 1.8, vy: t.vy - 1.0 };

              state.slashes.push({
                x1: state.reticleX - dx * 2.2,
                y1: state.reticleY - dy * 2.2,
                x2: state.reticleX + dx * 2.2,
                y2: state.reticleY + dy * 2.2,
                life: 12,
              });

              if (t.type === 'bomb') {
                state.score = Math.max(0, state.score - 15);
                state.screenShake = 10;
                for (let j = 0; j < 20; j++) {
                  state.particles.push({
                    x: t.x,
                    y: t.y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    radius: 3 + Math.random() * 5,
                    color: '#ef4444',
                    alpha: 1.0,
                    life: 30,
                  });
                }
              } else {
                const points = t.type === 'eye-drop' ? 20 : 10;
                state.score += points;

                const splashColor = t.type === 'eye-drop' ? '#38bdf8' : t.type === 'dust' ? '#b45309' : '#10b981';
                for (let j = 0; j < 12; j++) {
                  state.particles.push({
                    x: t.x,
                    y: t.y,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    radius: 2 + Math.random() * 3,
                    color: splashColor,
                    alpha: 1.0,
                    life: 25,
                  });
                }
              }
              setScore(state.score);
            }
          } else {
            t.hoverProgress = 0;
          }

          if (t.y - t.radius > CANVAS_HEIGHT + 40) {
            state.targets.splice(i, 1);
          }

        } else {
          t.slicePartL.vy += GRAVITY * 1.5;
          t.slicePartL.x += t.slicePartL.vx;
          t.slicePartL.y += t.slicePartL.vy;

          t.slicePartR.vy += GRAVITY * 1.5;
          t.slicePartR.x += t.slicePartR.vx;
          t.slicePartR.y += t.slicePartR.vy;

          if (t.slicePartL.y > CANVAS_HEIGHT + 50 && t.slicePartR.y > CANVAS_HEIGHT + 50) {
            state.targets.splice(i, 1);
          }
        }
      }

      state.slashes.forEach((s) => s.life--);
      state.slashes = state.slashes.filter((s) => s.life > 0);

      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.alpha = p.life / 30;
      });
      state.particles = state.particles.filter((p) => p.life > 0);

      draw();
      animationFrameRef.current = requestAnimationFrame(updateGame);
    };

    const draw = () => {
      const state = gameRef.current;
      ctx.save();

      if (state.screenShake > 0) {
        ctx.translate((Math.random() - 0.5) * state.screenShake, (Math.random() - 0.5) * state.screenShake);
      }

      const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bgGrad.addColorStop(0, '#03050c');
      bgGrad.addColorStop(1, '#090d1b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Grid background
      ctx.strokeStyle = 'rgba(255,255,255,0.015)';
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_WIDTH; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
        ctx.stroke();
      }

      state.targets.forEach((t) => {
        let color = '#2563eb';
        let glow = 'rgba(37, 99, 235, 0.4)';
        let nameText = '';

        if (t.type === 'bacteria') {
          color = '#10b981';
          glow = 'rgba(16, 185, 129, 0.4)';
          nameText = language === 'vi' ? '👾 Vi khuẩn' : language === 'km' ? '👾 មេរោគ' : '👾 Bacteria';
        } else if (t.type === 'dust') {
          color = '#b45309';
          glow = 'rgba(180, 83, 9, 0.4)';
          nameText = language === 'vi' ? '☁️ Bụi bẩn' : language === 'km' ? '☁️ ធូលី' : '☁️ Dust';
        } else if (t.type === 'eye-drop' && !t.sliced) {
          color = '#38bdf8';
          glow = 'rgba(56, 189, 248, 0.4)';
          nameText = language === 'vi' ? '💧 Nước mắt' : language === 'km' ? '💧 ទឹកភ្នែក' : '💧 Drop';
        } else if (t.type === 'bomb') {
          color = '#ef4444';
          glow = 'rgba(239, 68, 68, 0.5)';
          nameText = language === 'vi' ? '⚠️ BOM' : language === 'km' ? '⚠️ គ្រាប់បែក' : '⚠️ BOMB';
        }

        ctx.save();
        if (!t.sliced) {
          ctx.shadowColor = glow;
          ctx.shadowBlur = 15;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius - 3, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(nameText, t.x, t.y);
        } else {
          ctx.save();
          ctx.translate(t.slicePartL.x, t.slicePartL.y);
          ctx.rotate(t.sliceAngle + (state.frameCount * 0.04));
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(0, 0, t.radius, Math.PI / 2, (3 * Math.PI) / 2);
          ctx.fill();
          ctx.restore();

          ctx.save();
          ctx.translate(t.slicePartR.x, t.slicePartR.y);
          ctx.rotate(t.sliceAngle - (state.frameCount * 0.04));
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(0, 0, t.radius, (3 * Math.PI) / 2, Math.PI / 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      });

      state.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      state.slashes.forEach((s) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = s.life * 0.4 + 1;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(s.x2, s.y2);
        ctx.stroke();
      });

      // Target reticle
      ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.arc(state.reticleX, state.reticleY, 15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(state.reticleX, state.reticleY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    updateGame();

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, language]);

  return (
    <div className="relative w-screen h-screen bg-[#04060d] text-white flex flex-col font-sans select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-at-t from-sky-950/25 via-transparent to-transparent pointer-events-none z-0" />

      {/* Header bar overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => navigate('/explore')}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition duration-200 backdrop-blur-md"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('eyeNinjaGame.btnBack')}
        </button>

        <h1 className="text-lg md:text-xl font-black bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
          VISTA Eye Ninja
        </h1>
      </div>

      {/* Full Screen Game Container */}
      <div className="relative flex-grow w-full h-full flex items-center justify-center z-10">
        
        {/* Main Canvas covering full screen context */}
        <div className="relative bg-[#070914] border border-white/10 shadow-2xl overflow-hidden w-full h-full flex items-center justify-center">
          
          {/* 1. Menu State */}
          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-[#04060d]/90 flex flex-col items-center justify-center p-6 text-center z-35">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md flex flex-col items-center"
              >
                <h2 className="text-3xl md:text-4xl font-extrabold text-sky-400 mb-2 leading-tight">
                  {t('eyeNinjaGame.title')}
                </h2>
                <p className="text-sm text-white/60 mb-6 font-medium">
                  {t('eyeNinjaGame.subtitle')}
                </p>

                {!playMode ? (
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={startCameraMode}
                      className="py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:shadow-lg hover:shadow-sky-500/25 transition font-bold text-white text-base"
                    >
                      {t('eyeNinjaGame.startCam')}
                    </button>
                    <button
                      onClick={() => setPlayMode('mouse')}
                      className="py-3 px-6 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 transition font-bold text-white/90 text-base"
                    >
                      {t('eyeNinjaGame.startMouse')}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full">
                    {modelLoading && (
                      <div className="flex flex-col items-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400 mb-2" />
                        <span className="text-sm text-sky-300 font-medium">
                          {t('common.loading')}
                        </span>
                      </div>
                    )}

                    {!modelLoading && (
                      <>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-sm text-white/80 leading-relaxed max-w-sm">
                          <p className="font-semibold text-sky-300 mb-1">💡 Hướng dẫn chơi:</p>
                          <p className="mb-2">{t('eyeNinjaGame.instructions')}</p>
                          <p className="text-white/50 text-xs italic">{t('eyeNinjaGame.instructionsMouse')}</p>
                        </div>

                        <button
                          onClick={startGame}
                          className="w-full py-3 px-8 rounded-xl bg-sky-500 text-white font-extrabold hover:bg-sky-400 transition text-lg shadow-lg shadow-sky-500/20"
                        >
                          {t('eyeNinjaGame.btnStart')}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* 2. Gameover State */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-[#04060d]/95 flex flex-col items-center justify-center p-6 text-center z-35">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md flex flex-col items-center"
              >
                <span className="text-red-500 font-black text-xl tracking-wider uppercase mb-1">
                  {t('eyeNinjaGame.gameOver')}
                </span>
                
                <div className="flex gap-8 my-4">
                  <div>
                    <p className="text-xs text-white/40 uppercase font-semibold">{t('eyeNinjaGame.score')}</p>
                    <p className="text-4xl font-black text-white">{score}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase font-semibold">{t('eyeNinjaGame.highScore')}</p>
                    <p className="text-4xl font-black text-yellow-400">{highScore}</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 my-4 max-w-sm">
                  <p className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-1">
                    {t('eyeNinjaGame.tipsTitle')}
                  </p>
                  <p className="text-sm text-white/80 leading-relaxed italic">
                    "{gameRef.current.currentTip}"
                  </p>
                </div>

                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={startGame}
                    className="flex-grow py-3 px-6 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 transition shadow-lg shadow-sky-500/10"
                  >
                    {t('eyeNinjaGame.btnPlayAgain')}
                  </button>
                  <button
                    onClick={() => setPlayMode(null)}
                    className="py-3 px-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-white/80"
                  >
                    Chế độ chơi
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Interactive Canvas */}
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseMove={handleMouseMove}
            className="w-full h-full object-cover cursor-crosshair"
          />

          {/* Score Overlay */}
          {gameState === 'playing' && (
            <div className="absolute top-4 right-4 bg-black/45 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-md text-right z-15">
              <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider">
                {t('eyeNinjaGame.score')}
              </span>
              <span className="text-2xl font-black text-white">
                {score}
              </span>
            </div>
          )}

          {/* In-game tips overlay at bottom */}
          {gameState === 'playing' && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-sky-950/40 border border-sky-900/40 rounded-xl px-6 py-2.5 backdrop-blur-md text-center text-xs md:text-sm text-sky-300 font-medium max-w-lg z-15">
              💡 <span className="italic">{gameRef.current.currentTip}</span>
            </div>
          )}

          {/* Translucent PIP Webcam Preview in the bottom-left corner */}
          {playMode === 'camera' && gameState === 'playing' && (
            <div className="absolute bottom-4 left-4 w-36 aspect-video bg-[#0b101f]/75 border border-white/15 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm z-25">
              <Webcam
                ref={webcamRef}
                audio={false}
                mirrored={true}
                videoConstraints={{
                  width: 160,
                  height: 120,
                  facingMode: 'user',
                }}
                className="w-full h-full object-cover opacity-80"
              />
              {faceDetected ? (
                <div className="absolute bottom-1 right-1 bg-emerald-500/80 text-[8px] px-1 py-0.2 rounded font-bold uppercase tracking-wider text-white">
                  Eye ON
                </div>
              ) : (
                <div className="absolute bottom-1 right-1 bg-red-500/80 text-[8px] px-1 py-0.2 rounded font-bold uppercase tracking-wider text-white animate-pulse">
                  No Pupil
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Floating Diagnostics & Sensitivity Controls overlay (Top Right when playing) */}
      {playMode === 'camera' && gameState === 'playing' && (
        <div className="absolute top-16 right-4 w-52 bg-[#0b101f]/80 border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-md z-25 flex flex-col gap-2">
          <div className="flex justify-between text-[10px] text-white/50 font-bold uppercase tracking-wider">
            <span>Iris sensitivity:</span>
            <span>{sensitivity.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="3.0"
            max="9.0"
            step="0.5"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
            className="w-full accent-sky-400 bg-white/10 rounded-lg cursor-pointer h-1"
          />
          <button
            onClick={calibrateCenter}
            className="w-full py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-[9px] font-bold text-white/80"
          >
            🎯 Calibrate Eyes
          </button>
        </div>
      )}

    </div>
  );
}
