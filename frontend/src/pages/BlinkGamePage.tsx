import React, { useEffect, useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

// --- Game Settings ---
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const GRAVITY = 0.12;
const JUMP_FORCE = -4.2;
const OBSTACLE_SPEED_START = 2.0;
const OBSTACLE_SPAWN_RATE = 160; // frames
const GAP_SIZE_START = 240;

interface Obstacle {
  x: number;
  topHeight: number;
  bottomHeight: number;
  width: number;
  passed: boolean;
  type: 'dust' | 'blue-light' | 'bacteria';
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

export default function BlinkGamePage() {
  const { t, tArray, language } = useLanguage();
  const navigate = useNavigate();

  // Refs
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const trackingIntervalRef = useRef<number | null>(null);

  // Mode & States
  const [playMode, setPlayMode] = useState<'camera' | 'keyboard' | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('vista-blink-highscore') || '0');
  });

  // EAR parameters
  const [earValue, setEarValue] = useState<number>(0.3);
  const [blinkThreshold, setBlinkThreshold] = useState<number>(0.21);
  const [lastBlinkTime, setLastBlinkTime] = useState<number>(0);
  const isEyeClosedRef = useRef(false);

  // Game entities refs (to prevent React state updates from clogging high-speed loop)
  const gameRef = useRef({
    birdY: 250,
    birdVy: 0,
    birdRadius: 18,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    score: 0,
    speed: OBSTACLE_SPEED_START,
    frameCount: 0,
    gapSize: GAP_SIZE_START,
    currentTip: '',
    bgScroll: 0,
    isBlinkingNow: false,
    floatFrames: 0,
  });

  // Get eye health tips
  const eyeTips = tArray('blinkGame.tips');
  const getNextTip = useCallback(() => {
    if (eyeTips && eyeTips.length > 0) {
      const idx = Math.floor(Math.random() * eyeTips.length);
      gameRef.current.currentTip = eyeTips[idx];
    } else {
      gameRef.current.currentTip = "Blink regularly to keep your eyes moist!";
    }
  }, [eyeTips]);

  // Load Model
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
      alert('Không thể tải mô hình AI. Vui lòng thử lại hoặc chơi bằng bàn phím.');
      setPlayMode('keyboard');
    } finally {
      setModelLoading(false);
    }
  };

  // Keyboard or Blink Trigger
  const triggerFlap = useCallback((isBlink = false) => {
    if (gameState === 'playing') {
      gameRef.current.birdVy = JUMP_FORCE;
      if (isBlink) {
        // Blink helper: briefly slow down gravity at the crest of the jump
        gameRef.current.floatFrames = 12;
      } else {
        gameRef.current.floatFrames = 0;
      }
      
      // Spawn splash particles
      for (let i = 0; i < 8; i++) {
        gameRef.current.particles.push({
          x: 80,
          y: gameRef.current.birdY,
          vx: -2 - Math.random() * 4,
          vy: -2 + Math.random() * 4,
          radius: 2 + Math.random() * 3,
          color: 'rgba(56, 189, 248, 0.8)',
          alpha: 1,
          life: 30 + Math.random() * 20,
        });
      }
    } else if (gameState === 'menu') {
      startGame();
    } else if (gameState === 'gameover') {
      startGame();
    }
  }, [gameState]);

  // Handle keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        triggerFlap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerFlap]);

  // Distance formula for EAR calculation
  const getDistance = (p1: any, p2: any) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  // Tracking loop
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

              // Calculate EAR
              // Left Eye: corners (33, 133), eyelids (159, 145)
              const dLeftVert = getDistance(landmarks[159], landmarks[145]);
              const dLeftHoriz = getDistance(landmarks[33], landmarks[133]);
              const leftEAR = dLeftHoriz > 0 ? dLeftVert / dLeftHoriz : 0.3;

              // Right Eye: corners (362, 263), eyelids (386, 374)
              const dRightVert = getDistance(landmarks[386], landmarks[374]);
              const dRightHoriz = getDistance(landmarks[362], landmarks[263]);
              const rightEAR = dRightHoriz > 0 ? dRightVert / dRightHoriz : 0.3;

              const avgEAR = (leftEAR + rightEAR) / 2;
              setEarValue(avgEAR);

              // Blink detection logic
              if (avgEAR < blinkThreshold) {
                if (!isEyeClosedRef.current) {
                  isEyeClosedRef.current = true;
                  setLastBlinkTime(timestamp);
                  triggerFlap(true);
                }
              } else {
                isEyeClosedRef.current = false;
              }
            } else {
              setFaceDetected(false);
            }
          } catch (e) {
            console.error('Detection error', e);
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
  }, [faceLandmarker, playMode, blinkThreshold, triggerFlap]);

  // Start game
  const startGame = () => {
    getNextTip();
    gameRef.current = {
      birdY: 200,
      birdVy: 0,
      birdRadius: 16,
      obstacles: [],
      particles: [],
      score: 0,
      speed: OBSTACLE_SPEED_START,
      frameCount: 0,
      gapSize: GAP_SIZE_START,
      currentTip: gameRef.current.currentTip,
      bgScroll: 0,
      isBlinkingNow: false,
      floatFrames: 0,
    };
    setScore(0);
    setGameState('playing');
  };

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const updatePhysics = () => {
      if (!active) return;

      const state = gameRef.current;
      state.frameCount++;

      // Background Scroll
      state.bgScroll = (state.bgScroll + 0.5) % CANVAS_WIDTH;

      // Gravity & Bird with Blink Hover mechanic
      if (state.floatFrames > 0) {
        state.floatFrames--;
        state.birdVy += GRAVITY * 0.25; // Much lighter gravity at the crest of the jump
      } else {
        state.birdVy += GRAVITY;
      }
      state.birdY += state.birdVy;

      // Bound checks
      if (state.birdY - state.birdRadius < 0) {
        state.birdY = state.birdRadius;
        state.birdVy = 0;
      }
      if (state.birdY + state.birdRadius > CANVAS_HEIGHT) {
        endGame();
        return;
      }

      // Trail Particles
      if (state.frameCount % 2 === 0) {
        state.particles.push({
          x: 80 - state.birdRadius / 2,
          y: state.birdY + (Math.random() - 0.5) * 6,
          vx: -1.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: 2 + Math.random() * 4,
          color: 'rgba(125, 211, 252, 0.45)',
          alpha: 0.8,
          life: 40,
        });
      }

      // Handle Particles
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.alpha = p.life / 50;
      });
      state.particles = state.particles.filter((p) => p.life > 0);

      // Keep difficulty constant and super easy
      state.speed = OBSTACLE_SPEED_START;
      state.gapSize = GAP_SIZE_START;

      // Spawning Obstacles
      if (state.frameCount % OBSTACLE_SPAWN_RATE === 0 || state.obstacles.length === 0) {
        const minH = 50;
        const maxH = CANVAS_HEIGHT - state.gapSize - minH;
        const topHeight = minH + Math.random() * (maxH - minH);
        const bottomHeight = CANVAS_HEIGHT - state.gapSize - topHeight;
        
        // Randomize obstacle type
        const types: ('dust' | 'blue-light' | 'bacteria')[] = ['dust', 'blue-light', 'bacteria'];
        const type = types[Math.floor(Math.random() * types.length)];

        state.obstacles.push({
          x: CANVAS_WIDTH,
          topHeight,
          bottomHeight,
          width: 55,
          passed: false,
          type,
        });
      }

      // Move & Check Obstacles
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.x -= state.speed;

        // Collision Checks
        const bX = 80;
        const bY = state.birdY;
        const bRad = 3; // Super tiny 3px hitbox (practically impossible to hit)

        // Check top rectangle
        const hitTop =
          bX + bRad > obs.x &&
          bX - bRad < obs.x + obs.width &&
          bY - bRad < obs.topHeight;

        // Check bottom rectangle
        const hitBottom =
          bX + bRad > obs.x &&
          bX - bRad < obs.x + obs.width &&
          bY + bRad > CANVAS_HEIGHT - obs.bottomHeight;

        if (hitTop || hitBottom) {
          endGame();
          return;
        }

        // Score Check
        if (!obs.passed && obs.x + obs.width < bX) {
          obs.passed = true;
          state.score++;
          setScore(state.score);
        }

        // Remove offscreen
        if (obs.x + obs.width < 0) {
          state.obstacles.splice(i, 1);
        }
      }

      // Draw Everything
      draw();

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    const draw = () => {
      const state = gameRef.current;

      // Clear Canvas with clean gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bgGrad.addColorStop(0, '#0a0f1d');
      bgGrad.addColorStop(1, '#151e36');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw background bubbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
      for (let i = 0; i < 5; i++) {
        const bx = ((i * 200) - state.bgScroll + CANVAS_WIDTH) % CANVAS_WIDTH;
        const by = 80 + (i * 70) % 300;
        ctx.beginPath();
        ctx.arc(bx, by, 30 + (i * 10), 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Particles
      state.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Draw Obstacles
      state.obstacles.forEach((obs) => {
        let obsColor = '#4B5563'; // Fallback
        let glowColor = 'rgba(0,0,0,0)';
        let title = '';

        if (obs.type === 'dust') {
          obsColor = '#78350f'; // Brown
          glowColor = 'rgba(120, 53, 15, 0.4)';
          title = language === 'vi' ? 'BỤI BẨN' : language === 'km' ? 'ធូលី' : 'DUST';
        } else if (obs.type === 'blue-light') {
          obsColor = '#2563eb'; // Blue
          glowColor = 'rgba(37, 99, 235, 0.4)';
          title = language === 'vi' ? 'ÁNH SÁNG XANH' : language === 'km' ? 'ពន្លឺខៀវ' : 'BLUE LIGHT';
        } else if (obs.type === 'bacteria') {
          obsColor = '#059669'; // Greenish
          glowColor = 'rgba(5, 150, 105, 0.4)';
          title = language === 'vi' ? 'VI KHUẨN' : language === 'km' ? 'មេរោគ' : 'BACTERIA';
        }

        // Draw top pipe
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 15;
        
        ctx.fillStyle = obsColor;
        ctx.beginPath();
        ctx.roundRect(obs.x, 0, obs.width, obs.topHeight, [0, 0, 8, 8]);
        ctx.fill();

        // Draw bottom pipe
        ctx.beginPath();
        ctx.roundRect(obs.x, CANVAS_HEIGHT - obs.bottomHeight, obs.width, obs.bottomHeight, [8, 8, 0, 0]);
        ctx.fill();

        ctx.shadowBlur = 0; // Reset shadow

        // Label on pipes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, obs.x + obs.width / 2, obs.topHeight - 12);
        ctx.fillText(title, obs.x + obs.width / 2, CANVAS_HEIGHT - obs.bottomHeight + 20);
      });

      // Draw Tear Drop (Player)
      const bY = state.birdY;
      const bRad = state.birdRadius;

      // Draw Glowing Aura
      ctx.shadowColor = 'rgba(56, 189, 248, 0.7)';
      ctx.shadowBlur = 20;

      // Draw tear shape
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      // Drop start from top point, curves down to circular base
      ctx.moveTo(80, bY - bRad * 1.3);
      ctx.bezierCurveTo(80 + bRad * 1.1, bY - bRad * 0.4, 80 + bRad * 1.1, bY + bRad, 80, bY + bRad);
      ctx.bezierCurveTo(80 - bRad * 1.1, bY + bRad, 80 - bRad * 1.1, bY - bRad * 0.4, 80, bY - bRad * 1.3);
      ctx.closePath();
      ctx.fill();

      // Shiny glare reflection inside tear
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.beginPath();
      ctx.arc(80 - bRad * 0.3, bY - bRad * 0.2, bRad * 0.25, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0; // Reset shadow

      // Cute Eyes on Tear Drop
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(80 - 4, bY + 1, 2.2, 0, Math.PI * 2);
      ctx.arc(80 + 4, bY + 1, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Cute Smile
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(80, bY + 3, 2.5, 0, Math.PI);
      ctx.stroke();
    };

    updatePhysics();

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState]);

  const endGame = () => {
    setGameState('gameover');
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const state = gameRef.current;
    if (state.score > highScore) {
      setHighScore(state.score);
      localStorage.setItem('vista-blink-highscore', String(state.score));
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070b14] text-white flex flex-col font-sans select-none overflow-x-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 bg-radial-at-t from-sky-950/20 via-transparent to-transparent pointer-events-none z-0" />

      {/* Header Row */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition duration-200 backdrop-blur-md"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('blinkGame.btnBack')}
        </button>

        <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
          VISTA Blink Flight
        </h1>
      </div>

      {/* Main Game Interface */}
      <div className="relative z-10 flex-grow max-w-6xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Game Canvas Container (spans 3 columns) */}
        <div className="lg:col-span-3 flex flex-col items-center">
          <div className="relative bg-[#0d1324] border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-[800px] aspect-[8/5]">
            
            {/* 1. Menu State */}
            {gameState === 'menu' && (
              <div className="absolute inset-0 bg-[#070b14]/90 flex flex-col items-center justify-center p-6 text-center z-20">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-md flex flex-col items-center"
                >
                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-extrabold text-sky-400 mb-2 leading-tight">
                    {t('blinkGame.title')}
                  </h2>
                  <p className="text-sm text-white/60 mb-6 font-medium">
                    {t('blinkGame.subtitle')}
                  </p>

                  {/* Mode Selector */}
                  {!playMode ? (
                    <div className="flex flex-col gap-3 w-full">
                      <button
                        onClick={startCameraMode}
                        className="py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:shadow-lg hover:shadow-sky-500/25 transition font-bold text-white text-base"
                      >
                        {t('blinkGame.startCam')}
                      </button>
                      <button
                        onClick={() => setPlayMode('keyboard')}
                        className="py-3 px-6 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 transition font-bold text-white/90 text-base"
                      >
                        {t('blinkGame.startKeyboard')}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center w-full">
                      {/* Loading Model */}
                      {modelLoading && (
                        <div className="flex flex-col items-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400 mb-2" />
                          <span className="text-sm text-sky-300 font-medium">
                            {t('common.loading')}
                          </span>
                        </div>
                      )}

                      {/* Ready to start */}
                      {!modelLoading && (
                        <>
                          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-sm text-white/80 leading-relaxed max-w-sm">
                            <p className="font-semibold text-sky-300 mb-1">💡 Hướng dẫn chơi:</p>
                            <p className="mb-2">{t('blinkGame.instructions')}</p>
                            <p className="text-white/50 text-xs italic">{t('blinkGame.instructionsKeyboard')}</p>
                          </div>

                          <button
                            onClick={startGame}
                            className="w-full py-3 px-8 rounded-xl bg-sky-500 text-white font-extrabold hover:bg-sky-400 transition text-lg shadow-lg shadow-sky-500/20"
                          >
                            {t('blinkGame.btnStart')}
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
              <div className="absolute inset-0 bg-[#070b14]/95 flex flex-col items-center justify-center p-6 text-center z-20">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-md flex flex-col items-center"
                >
                  <span className="text-red-500 font-black text-xl tracking-wider uppercase mb-1">
                    {t('blinkGame.gameOver')}
                  </span>
                  
                  <div className="flex gap-8 my-4">
                    <div>
                      <p className="text-xs text-white/40 uppercase font-semibold">{t('blinkGame.score')}</p>
                      <p className="text-4xl font-black text-white">{score}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase font-semibold">{t('blinkGame.highScore')}</p>
                      <p className="text-4xl font-black text-yellow-400">{highScore}</p>
                    </div>
                  </div>

                  {/* Eye Health Tip Box */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 my-4 max-w-sm">
                    <p className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-1">
                      {t('blinkGame.tipsTitle')}
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
                      {t('blinkGame.btnPlayAgain')}
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

            {/* Canvas Rendering Game */}
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onClick={() => triggerFlap(false)}
              className="w-full h-full block cursor-pointer"
            />

            {/* Current In-game Score overlay */}
            {gameState === 'playing' && (
              <div className="absolute top-4 right-4 bg-black/40 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-md text-right">
                <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider">
                  {t('blinkGame.score')}
                </span>
                <span className="text-2xl font-black text-white">
                  {score}
                </span>
              </div>
            )}
          </div>

          {/* Tips bar under canvas when playing */}
          {gameState === 'playing' && (
            <div className="mt-4 w-full max-w-[800px] px-4 py-3 rounded-xl bg-sky-950/20 border border-sky-900/35 text-center text-xs md:text-sm text-sky-300 font-medium">
              💡 <span className="italic">{gameRef.current.currentTip}</span>
            </div>
          )}
        </div>

        {/* Sidebar Controls (Webcam, Calibration) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Webcam Box & AI diagnostics */}
          {playMode === 'camera' && (
            <div className="bg-[#0d1324] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col gap-4">
              <h3 className="text-sm font-bold text-sky-400 uppercase tracking-widest">
                AI Tracking
              </h3>

              {/* Camera Container */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  mirrored={true}
                  videoConstraints={{
                    width: 320,
                    height: 240,
                    facingMode: 'user',
                  }}
                  className="w-full h-full object-cover"
                />

                {/* Tracking overlay */}
                {faceDetected ? (
                  <div className="absolute top-2 left-2 bg-emerald-500/80 text-[10px] px-2 py-0.5 rounded font-bold uppercase text-white tracking-widest backdrop-blur-sm">
                    Live
                  </div>
                ) : (
                  <div className="absolute top-2 left-2 bg-red-500/80 text-[10px] px-2 py-0.5 rounded font-bold uppercase text-white tracking-widest backdrop-blur-sm animate-pulse">
                    No Face
                  </div>
                )}
              </div>

              {/* EAR and sensitivity slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>{t('blinkGame.ear')}:</span>
                  <span className={`font-mono font-bold ${earValue < blinkThreshold ? 'text-red-400' : 'text-emerald-400'}`}>
                    {earValue.toFixed(3)}
                  </span>
                </div>

                {/* Diagnostic bar */}
                <div className="h-3 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-sky-500 transition-all duration-75"
                    style={{ width: `${Math.min(100, earValue * 250)}%` }}
                  />
                  {/* Threshold mark */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                    style={{ left: `${blinkThreshold * 250}%` }}
                  />
                </div>

                {/* Adjust Threshold Slider */}
                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Độ nhạy nháy mắt:</span>
                    <span className="font-mono">{blinkThreshold.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.30"
                    step="0.01"
                    value={blinkThreshold}
                    onChange={(e) => setBlinkThreshold(parseFloat(e.target.value))}
                    className="w-full accent-sky-400 bg-white/10 rounded-lg cursor-pointer h-1.5"
                  />
                  <span className="text-[10px] text-white/40 leading-normal">
                    *Kéo thanh để tăng/giảm độ nhạy nháy mắt tùy ánh sáng phòng.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Keyboard Info box */}
          {playMode === 'keyboard' && (
            <div className="bg-[#0d1324] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
              <h3 className="text-sm font-bold text-sky-400 uppercase tracking-widest">
                Controls
              </h3>
              <div className="flex flex-col gap-2 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <kbd className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-xs font-mono">Spacebar</kbd>
                  <span>Vỗ cánh (Bay lên)</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-xs font-mono">Chạm</kbd>
                  <span>Chạm màn hình để bay</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 mt-1">
                <button
                  onClick={startCameraMode}
                  className="w-full py-2 px-3 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-xs font-bold transition"
                >
                  ⚡ Chuyển sang chế độ Camera AI
                </button>
              </div>
            </div>
          )}

          {/* Educational info widget */}
          <div className="bg-[#0d1324]/50 border border-white/5 rounded-2xl p-4 text-xs text-white/50 leading-relaxed flex flex-col gap-2">
            <h4 className="font-bold text-white/70">Tại sao trò chơi này có ích?</h4>
            <p>
              Khi tập trung vào màn hình, tần suất chớp mắt của chúng ta giảm tới 60%. Điều này làm lớp màng nước mắt bốc hơi nhanh, gây khô mắt và mỏi mắt kỹ thuật số.
            </p>
            <p className="font-medium text-sky-400">
              Hãy cố gắng chớp mắt sâu và đều đặn để bảo vệ thị lực của bạn nhé!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
