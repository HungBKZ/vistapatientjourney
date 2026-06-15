import React, { useEffect, useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const glassesList = [
  {
    id: 1,
    url: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1762103856/24834e7b77049d0a209d94660bec6ea9_extiiq.png',
    name: 'Classic Black',
    suitableFaceShape: ['oval', 'square', 'heart'],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.35,
    scaleMultiplier: 1.6,
  },
  {
    id: 2,
    url: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1762103781/fddb5610eedc1ef6fc8afe437bf64747_tyrduw.png',
    name: 'Modern Round',
    suitableFaceShape: ['oval', 'square', 'heart'],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.35,
    scaleMultiplier: 1.7,
  },
  {
    id: 3,
    url: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1762102471/3e0f4e202ed3796ec83de3150b89db71_k14kgm.png',
    name: 'Cat Eye Style',
    suitableFaceShape: ['oval', 'round', 'square'],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.32,
    scaleMultiplier: 1.5,
  },
  {
    id: 4,
    url: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1762102472/d66d48cf51672a8678758178aea52799_jhs2jf.png',
    name: 'Aviator Gold',
    suitableFaceShape: ['square', 'round', 'triangle'],
    minFaceWidth: 0.18,
    maxFaceWidth: 0.4,
    scaleMultiplier: 1.8,
  },
  {
    id: 5,
    url: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1762102471/91eb9dc8a4240f9ba9f2ccc2c6550cc3_k80ndg.png',
    name: 'Rectangle Frame',
    suitableFaceShape: ['oval', 'round', 'heart'],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.35,
    scaleMultiplier: 1.7,
  },
  {
    id: 6,
    url: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1762102016/52b0cc13216e2e91ee14ab167acda2db_hzcp17.png',
    name: 'Retro Classic',
    suitableFaceShape: ['oval', 'square', 'triangle'],
    minFaceWidth: 0.15,
    maxFaceWidth: 0.38,
    scaleMultiplier: 1.6,
  },
];

// Smoothing factor (lower = smoother)
const SMOOTHING_FACTOR = 0.25;
// Tolerance before hiding glasses
const MISS_TOLERANCE = 15;
// Tolerance before showing "searching" badge
const SEARCHING_DEBOUNCE = 20;

export default function VirtualTryOnPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
  const [glassIndex, setGlassIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [faceAnalysis, setFaceAnalysis] = useState<any>(null);
  const [faceVisible, setFaceVisible] = useState(false);
  const [searching, setSearching] = useState(true);
  const [modelLoading, setModelLoading] = useState(true);

  const glassesImagesRef = useRef<{ [key: number]: HTMLImageElement }>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [glassesEnabled, setGlassesEnabled] = useState(true);

  // Ref mirrors to avoid effect re-runs
  const glassIndexRef = useRef(glassIndex);
  const autoModeRef = useRef(autoMode);
  const glassesEnabledRef = useRef(glassesEnabled);
  useEffect(() => { glassIndexRef.current = glassIndex; }, [glassIndex]);
  useEffect(() => { autoModeRef.current = autoMode; }, [autoMode]);
  useEffect(() => { glassesEnabledRef.current = glassesEnabled; }, [glassesEnabled]);

  // Smoothed positions
  const smoothedRef = useRef<{
    eyeCenterX: number;
    eyeCenterY: number;
    angle: number;
    eyeDistance: number;
    faceWidth: number;
    yaw: number;
    pitch: number;
    initialized: boolean;
  }>({ eyeCenterX: 0, eyeCenterY: 0, angle: 0, eyeDistance: 0, faceWidth: 0, yaw: 0, pitch: 0, initialized: false });

  const missCounterRef = useRef(0);

  // Analyze face and find recommended glasses
  const analyzeFaceAndRecommend = useCallback((faceLandmarks: any) => {
    if (!faceLandmarks || faceLandmarks.length === 0) return null;

    const face = faceLandmarks[0];
    const leftEye = face[33];
    const rightEye = face[263];
    const chin = face[152];
    const leftCheek = face[234];
    const rightCheek = face[454];
    const forehead = face[10];

    const eyeDistance = Math.abs(rightEye.x - leftEye.x);
    const faceHeight = Math.abs(chin.y - forehead.y);
    const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
    const faceRatio = faceWidth / faceHeight;

    let faceShape = 'oval';
    if (faceRatio > 0.85) {
      faceShape = 'round';
    } else if (faceRatio < 0.65) {
      faceShape = 'triangle';
    } else if (faceRatio >= 0.75 && faceRatio <= 0.85) {
      faceShape = 'square';
    } else if (faceRatio >= 0.65 && faceRatio < 0.75) {
      faceShape = 'heart';
    }

    const suitableGlasses = glassesList.filter(
      (glass) =>
        glass.suitableFaceShape.includes(faceShape) &&
        eyeDistance >= glass.minFaceWidth &&
        eyeDistance <= glass.maxFaceWidth
    );

    const recommended = suitableGlasses.length > 0 ? suitableGlasses[0] : glassesList[0];

    return {
      faceShape,
      recommendedGlass: recommended,
    };
  }, []);

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const promises = glassesList.map((glass) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            glassesImagesRef.current[glass.id] = img;
            resolve();
          };
          img.onerror = () => resolve();
          img.src = glass.url;
        });
      });

      await Promise.all(promises);
      setImagesLoaded(true);
    };

    loadImages();
  }, []);

  // Initialize MediaPipe
  useEffect(() => {
    let cancelled = false;
    async function initFace() {
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
        if (!cancelled) {
          setFaceLandmarker(detector);
          setModelLoading(false);
        }
      } catch (err) {
        console.error('Failed to load face landmarker', err);
        if (!cancelled) setModelLoading(false);
      }
    }
    initFace();
    return () => { cancelled = true; };
  }, []);

  // Main draw loop
  useEffect(() => {
    let animationId: number;
    let lastVideoTime = -1;

    const draw = async () => {
      if (!webcamRef.current || !faceLandmarker) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let results: any = null;
      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        results = faceLandmarker.detectForVideo(video, performance.now());
      }

      const hasFace = results?.faceLandmarks?.length > 0;

      if (hasFace) {
        if (missCounterRef.current !== 0) missCounterRef.current = 0;
        setFaceVisible((prev) => (prev ? prev : true));
        setSearching((prev) => (prev ? false : prev));

        const analysis = analyzeFaceAndRecommend(results.faceLandmarks);
        if (analysis) {
          setFaceAnalysis((prev: any) =>
            prev?.faceShape === analysis.faceShape ? prev : analysis
          );
          if (autoModeRef.current && analysis.recommendedGlass) {
            const recommendedIndex = glassesList.findIndex(
              (g) => g.id === analysis.recommendedGlass.id
            );
            if (recommendedIndex !== -1 && recommendedIndex !== glassIndexRef.current) {
              setGlassIndex(recommendedIndex);
            }
          }
        }

        if (imagesLoaded) {
          const face = results.faceLandmarks[0];
          // Use landmarks:
          // 33: Left eye outer corner, 263: Right eye outer corner
          // 168: Nose bridge between eyes
          // 234: Left cheek, 454: Right cheek
          // 10: Forehead, 152: Chin
          const leftOuter = face[33];
          const rightOuter = face[263];
          const noseBridge = face[168];
          const leftCheek = face[234];
          const rightCheek = face[454];
          const forehead = face[10];
          const chin = face[152];

          // Anchor X at nose bridge (horizontal center of face), Y at midpoint of both eye outer corners (eye level)
          // noseBridge.x gives accurate horizontal center; eye midpoint Y gives the correct vertical eye level
          const eyeCenterX = noseBridge.x * canvas.width;
          const eyeCenterY = ((leftOuter.y + rightOuter.y) / 2) * canvas.height;

          // 3D Outer Eye Distance (combines x, y, and z depth to remain constant under head rotation)
          const dxOuter = (rightOuter.x - leftOuter.x) * canvas.width;
          const dyOuter = (rightOuter.y - leftOuter.y) * canvas.height;
          const dzOuter = (rightOuter.z - leftOuter.z) * canvas.width;
          const rawEyeDistance = Math.sqrt(dxOuter * dxOuter + dyOuter * dyOuter + dzOuter * dzOuter);

          // 3D Cheek-to-Cheek Distance (represents the physical width of the face)
          const dxCheek = (rightCheek.x - leftCheek.x) * canvas.width;
          const dyCheek = (rightCheek.y - leftCheek.y) * canvas.height;
          const dzCheek = (rightCheek.z - leftCheek.z) * canvas.width;
          const rawFaceWidth = Math.sqrt(dxCheek * dxCheek + dyCheek * dyCheek + dzCheek * dzCheek);

          // Roll (Z-rotation)
          const rawAngle = Math.atan2(dyOuter, dxOuter);

          // Yaw (Y-rotation)
          const rawYaw = Math.atan2(dzCheek, dxCheek);

          // Pitch (X-rotation)
          const dyFace = (chin.y - forehead.y) * canvas.height;
          const dzFace = (chin.z - forehead.z) * canvas.width;
          const rawPitch = Math.atan2(dzFace, dyFace);

          const s = smoothedRef.current;
          if (!s.initialized) {
            s.eyeCenterX = eyeCenterX;
            s.eyeCenterY = eyeCenterY;
            s.angle = rawAngle;
            s.eyeDistance = rawEyeDistance;
            s.faceWidth = rawFaceWidth;
            s.yaw = rawYaw;
            s.pitch = rawPitch;
            s.initialized = true;
          } else {
            const a = SMOOTHING_FACTOR;
            s.eyeCenterX += (eyeCenterX - s.eyeCenterX) * a;
            s.eyeCenterY += (eyeCenterY - s.eyeCenterY) * a;
            s.eyeDistance += (rawEyeDistance - s.eyeDistance) * a;
            s.faceWidth += (rawFaceWidth - s.faceWidth) * a;
            s.yaw += (rawYaw - s.yaw) * a;
            s.pitch += (rawPitch - s.pitch) * a;

            let angleDiff = rawAngle - s.angle;
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            s.angle += angleDiff * a;
          }
        }
      } else {
        missCounterRef.current += 1;

        if (missCounterRef.current > MISS_TOLERANCE) {
          setFaceVisible((prev) => (prev ? false : prev));
          smoothedRef.current.initialized = false;
        }
        if (missCounterRef.current > SEARCHING_DEBOUNCE) {
          setSearching((prev) => (prev ? prev : true));
        }
      }

      // Draw glasses
      const s = smoothedRef.current;
      if (
        glassesEnabledRef.current &&
        imagesLoaded &&
        s.initialized &&
        missCounterRef.current <= MISS_TOLERANCE
      ) {
        const currentGlass = glassesList[glassIndexRef.current];
        const scaleMultiplier = currentGlass.scaleMultiplier || 1.6;

        // Apply perspective compression based on yaw and pitch
        const yawCos = Math.abs(Math.cos(s.yaw));
        const pitchCos = Math.abs(Math.cos(s.pitch));

        // Glasses width = outer-eye-to-outer-eye distance × per-glasses scale multiplier
        // This is the most natural reference since glasses physically span across the outer eye corners
        // The scaleMultiplier slightly exceeds 1 to include the frame temple width
        const glassWidth = s.eyeDistance * scaleMultiplier * yawCos;
        // Height ratio: real glasses are roughly 40% as tall as they are wide
        const glassHeight = glassWidth * 0.42 * pitchCos;

        const glassesImg = glassesImagesRef.current[currentGlass.id];
        if (glassesImg) {
          ctx.save();
          ctx.translate(s.eyeCenterX, s.eyeCenterY);
          ctx.rotate(s.angle);
          ctx.drawImage(
            glassesImg,
            -glassWidth / 2,
            -glassHeight / 2,
            glassWidth,
            glassHeight
          );
          ctx.restore();
        }
      }

      animationId = requestAnimationFrame(draw);
    };
    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [faceLandmarker, analyzeFaceAndRecommend, imagesLoaded]);

  const capture = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoading(true);
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const finalCtx = finalCanvas.getContext('2d');
    if (finalCtx && webcamRef.current?.video) {
      finalCtx.save();
      finalCtx.translate(finalCanvas.width, 0);
      finalCtx.scale(-1, 1);
      finalCtx.drawImage(webcamRef.current.video, 0, 0, finalCanvas.width, finalCanvas.height);
      finalCtx.restore();

      finalCtx.save();
      finalCtx.translate(finalCanvas.width, 0);
      finalCtx.scale(-1, 1);
      finalCtx.drawImage(canvas, 0, 0);
      finalCtx.restore();
    }
    const imageSrc = finalCanvas.toDataURL('image/jpeg', 0.95);

    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.download = `VistaTryOn_${timestamp}.jpg`;
    link.href = imageSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setLoading(false), 500);
  };

  const faceShapeLabel = (shape: string) => {
    switch (shape) {
      case 'oval': return 'Trái xoan';
      case 'round': return 'Tròn';
      case 'square': return 'Vuông';
      case 'triangle': return 'Dài';
      case 'heart': return 'Trái tim';
      default: return shape;
    }
  };

  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollToIndex = (idx: number) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const items = container.querySelectorAll('[data-glass-item]');
      const targetItem = items[idx] as HTMLElement;
      if (targetItem) {
        const itemLeft = targetItem.offsetLeft;
        const itemWidth = targetItem.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollLeft = itemLeft - (containerWidth - itemWidth) / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    scrollToIndex(glassIndex);
  }, [glassIndex]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden select-none">
      {/* Full-screen camera section */}
      <div className="absolute inset-0 w-full h-full">
        <Webcam
          ref={webcamRef}
          mirrored={true}
          className="w-full h-full object-cover"
          videoConstraints={{
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full transform scale-x-[-1] pointer-events-none"
        />

        {/* Subtle vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {modelLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
          >
            <div className="flex flex-col items-center gap-3 text-white">
              <div className="w-9 h-9 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-sm font-medium">Đang tải mô hình nhận diện...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top-left: Back button - highly visible responsive size */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-40">
        <button
          onClick={() => navigate('/knowledge')}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black hover:bg-slate-100 flex items-center justify-center shadow-2xl transition-all active:scale-95 border border-white/10"
          title="Quay lại"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Top-right: Status badges */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-40 flex flex-col gap-1.5 md:gap-2 items-end">
        <AnimatePresence mode="wait">
          {faceVisible && faceAnalysis ? (
            <motion.div
              key="face-shape"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="bg-black/60 backdrop-blur-md text-[10px] md:text-xs px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-full font-medium border border-white/10 shadow-lg"
            >
              Dáng mặt: <span className="font-bold text-sky-400">{faceShapeLabel(faceAnalysis.faceShape)}</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {faceVisible ? (
            <motion.div
              key="detected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-emerald-500/90 backdrop-blur-md text-[10px] md:text-xs px-2.5 py-1 md:px-3 md:py-1.5 rounded-full font-semibold flex items-center gap-1.5 shadow-lg border border-emerald-400/20"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              Đã nhận diện
            </motion.div>
          ) : (
            searching &&
            !modelLoading && (
              <motion.div
                key="searching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-black/60 backdrop-blur-md text-[10px] md:text-xs px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-full font-medium border border-white/10 animate-pulse shadow-lg"
              >
                Đang tìm khuôn mặt...
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Right side controls */}
      <div className="absolute top-1/2 right-4 md:right-6 z-40 transform -translate-y-1/2 flex flex-col gap-3 md:gap-4">
        <button
          onClick={() => setGlassesEnabled(!glassesEnabled)}
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all backdrop-blur-md border shadow-lg ${glassesEnabled
            ? 'bg-white text-black border-white/30 hover:bg-slate-100'
            : 'bg-black/60 text-white border-white/10 hover:bg-black/80'
            }`}
          title={glassesEnabled ? 'Tắt kính' : 'Bật kính'}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        <button
          onClick={() => setAutoMode(!autoMode)}
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all backdrop-blur-md border shadow-lg ${autoMode
            ? 'bg-sky-500 text-white border-sky-400/50 hover:bg-sky-600'
            : 'bg-black/60 text-white border-white/10 hover:bg-black/80'
            }`}
          title={autoMode ? 'Tự động gợi ý: Bật' : 'Tự động gợi ý: Tắt'}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>

      {/* Capture Button: Positioned above the bottom menu (bottom-32 on mobile, bottom-40 on desktop) */}
      <div className="absolute bottom-32 md:bottom-40 left-1/2 z-40 transform -translate-x-1/2">
        <button
          onClick={capture}
          disabled={loading}
          className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full shadow-2xl flex items-center justify-center hover:bg-slate-100 active:scale-90 transition-all disabled:opacity-50 ring-4 ring-white/20"
          title="Chụp ảnh"
        >
          {loading ? (
            <div className="w-5 h-5 md:w-6 md:h-6 border-[3px] border-sky-200 border-t-sky-600 rounded-full animate-spin" />
          ) : (
            <div className="w-[44px] h-[44px] md:w-[50px] md:h-[50px] bg-white rounded-full border-2 border-slate-300" />
          )}
        </button>
      </div>

      {/* Bottom menu carousel: absolutely positioned at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-28 md:h-36 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col justify-end px-4 pb-4 md:px-6 md:pb-6 z-30">
        <div className="flex items-center gap-3 md:gap-4 overflow-x-auto scrollbar-hide py-1 md:py-2" ref={carouselRef}>
          {glassesList.map((g, idx) => (
            <button
              key={g.id}
              data-glass-item
              onClick={() => { setGlassIndex(idx); setAutoMode(false); }}
              className={`flex-shrink-0 rounded-lg md:rounded-xl transition-all border-2 overflow-hidden relative ${glassIndex === idx
                ? 'border-sky-500 ring-2 ring-sky-500/50 scale-105'
                : 'border-white/10 hover:border-white/30 hover:scale-102'
                }`}
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center ${glassIndex === idx ? 'bg-sky-500/20' : 'bg-white/5 backdrop-blur-sm'
                }`}>
                <img
                  src={g.url}
                  alt={g.name}
                  className={`w-[85%] object-contain transition-transform ${glassIndex === idx ? 'scale-110' : ''
                    }`}
                />
              </div>
            </button>
          ))}
        </div>
        <p className="text-white/50 text-[10px] md:text-xs mt-1.5 md:mt-2 text-center font-medium tracking-wide">
          {autoMode ? 'Chế độ gợi ý tự động (AI)' : 'Chạm để chọn mẫu kính'}
        </p>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}