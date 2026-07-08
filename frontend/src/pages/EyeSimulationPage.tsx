import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

// Danh sách các tình trạng mắt mô phỏng
type EyeConditionKey = 
  | 'normal' 
  | 'myopia' 
  | 'hyperopia' 
  | 'presbyopia' 
  | 'astigmatism' 
  | 'strabismus' 
  | 'cataract' 
  | 'glaucoma' 
  | 'macular'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';

interface EyeCondition {
  key: EyeConditionKey;
  category: 'refractive' | 'disease' | 'color';
  filterId?: string; // Cho mù màu
  labelVi: string;
  labelEn: string;
  labelKm: string;
  descVi: string;
  descEn: string;
  descKm: string;
}

const eyeConditions: EyeCondition[] = [
  // 1. Tật khúc xạ
  {
    key: 'normal',
    category: 'refractive',
    labelVi: 'Chính thị (Bình thường)',
    labelEn: 'Emmetropia (Normal)',
    labelKm: 'ចក្ខុវិស័យធម្មតា',
    descVi: 'Mắt bình thường, hình ảnh hội tụ đúng trên võng mạc. Nhìn rõ mọi vật ở các khoảng cách khác nhau.',
    descEn: 'Normal vision. Light rays focus perfectly on the retina. Clear vision at all distances.',
    descKm: 'ភ្នែកធម្មតា រូបភាពផ្តោតលើរេទីនបានត្រឹមត្រូវ។ ឃើញច្បាស់គ្រប់ចម្ងាយ។',
  },
  {
    key: 'myopia',
    category: 'refractive',
    labelVi: 'Cận thị (Myopia)',
    labelEn: 'Myopia (Nearsighted)',
    labelKm: 'ភ្នែកខ្លី (Myopia)',
    descVi: 'Nhìn gần rõ, nhìn xa mờ. Càng đứng xa màn hình (khoảng cách tăng), hình ảnh camera sẽ càng bị mờ đi.',
    descEn: 'Clear up close, blurry at a distance. As your distance from the screen increases, the camera blur increases.',
    descKm: 'មើលជិតច្បាស់ មើលឆ្ងាយស្រពិចស្រពិល。 ពេលឃ្លាតឆ្ងាយពីអេក្រង់ រូបភាពកាន់តែព្រិល។',
  },
  {
    key: 'hyperopia',
    category: 'refractive',
    labelVi: 'Viễn thị (Hyperopia)',
    labelEn: 'Hyperopia (Farsighted)',
    labelKm: 'ភ្នែកវែង (Hyperopia)',
    descVi: 'Nhìn xa rõ, nhìn gần mờ. Càng di chuyển lại gần màn hình (khoảng cách giảm), hình ảnh camera sẽ càng bị mờ.',
    descEn: 'Clear at a distance, blurry up close. As you move closer to the screen, the camera blur increases.',
    descKm: 'មើលឆ្ងាយច្បាស់ មើលជិតស្រពិចស្រពិល។ ពេលចូលកៀកអេក្រង់ រូបភាពកាន់តែព្រិល។',
  },
  {
    key: 'presbyopia',
    category: 'refractive',
    labelVi: 'Lão thị (Presbyopia)',
    labelEn: 'Presbyopia (Aging Eye)',
    labelKm: 'ភ្នែកចាស់ (Presbyopia)',
    descVi: 'Mất khả năng điều tiết tập trung nhìn gần của người lớn tuổi. Hình ảnh bị mờ ở khoảng cách đọc sách/điện thoại thông thường (~30-45cm) nhưng nhìn xa lại rõ.',
    descEn: 'Age-related loss of near focusing. Vision is blurry in the typical reading/phone range (~30-45cm) but clear at a distance.',
    descKm: 'ការបាត់បង់សមត្ថភាពមើលជិតរបស់មនុស្សចាស់។ រូបភាពព្រិលនៅចម្ងាយអានសៀវភៅធម្មតា (~30-45 សង់ទីម៉ែត្រ) តែមើលឆ្ងាយច្បាស់។',
  },
  {
    key: 'astigmatism',
    category: 'refractive',
    labelVi: 'Loạn thị (Astigmatism)',
    labelEn: 'Astigmatism',
    labelKm: 'ភ្នែកផ្អៀង (Astigmatism)',
    descVi: 'Hình ảnh bị nhòe và xuất hiện các bóng mờ kép theo hướng xiên lệch do giác mạc cong không đều.',
    descEn: 'Vision is distorted and stretched with ghosting/double edges due to an irregularly curved cornea.',
    descKm: 'រូបភាពស្រពិចស្រពិល និងមានស្រមោលស្ទួនតាមទិសដៅផ្សេងៗ ដោយសារកែវភ្នែកមិនស្មើគ្នា។',
  },
  // 2. Bệnh lý nhãn khoa
  {
    key: 'strabismus',
    category: 'disease',
    labelVi: 'Lác/Lé (Song thị - Diplopia)',
    labelEn: 'Strabismus (Diplopia)',
    labelKm: 'ភ្នែកស្រលៀង/ឡេវ (មើលឃើញស្ទួន)',
    descVi: 'Mô phỏng hiện tượng song thị (nhìn đôi) thường gặp ở người bị lác/lé, do hai trục nhãn cầu lệch hướng không đồng bộ.',
    descEn: 'Simulates double vision (diplopia) common in strabismus, where the optical axes of the eyes are misaligned.',
    descKm: 'ម៉ូទ័រនៃបាតុភូតមើលឃើញពីរ (ស្ទួន) ដែលច្រើនតែកើតមានចំពោះអ្នកភ្នែកស្រលៀង។',
  },
  {
    key: 'cataract',
    category: 'disease',
    labelVi: 'Đục thủy tinh thể (Cataract)',
    labelEn: 'Cataract',
    labelKm: 'ភ្នែកឡើងបាយ (Cataract)',
    descVi: 'Nhìn mờ toàn bộ như có màng sương che phủ, độ tương phản giảm mạnh kèm theo sắc thái ngả vàng/lóa ấm.',
    descEn: 'Overall cloudy vision like looking through a foggy window, with decreased contrast and a yellowish tint.',
    descKm: 'មើលឃើញព្រិលទាំងស្រុងដូចជាមានអ័ព្ទបាំង ភាពច្បាស់ថយចុះខ្លាំង រួមជាមួយពណ៌លឿងស្រអាប់។',
  },
  {
    key: 'glaucoma',
    category: 'disease',
    labelVi: 'Tăng nhãn áp (Glaucoma)',
    labelEn: 'Glaucoma (Tunnel Vision)',
    labelKm: 'ទឹកដក់ក្នុងភ្នែក (Glaucoma)',
    descVi: 'Tổn thương thần kinh thị giác làm thu hẹp dần thị trường ngoại vi, tạo hiệu ứng nhìn qua đường ống (tunnel vision).',
    descEn: 'Optic nerve damage leads to progressive loss of peripheral vision, resulting in a tunnel vision effect.',
    descKm: 'ការខូចខាតសរសៃប្រសាទភ្នែកធ្វើឱ្យរួមតូចចក្ខុវិស័យជុំវិញ បង្កើតឥទ្ធិពលមើលតាមបំពង់។',
  },
  {
    key: 'macular',
    category: 'disease',
    labelVi: 'Thoái hóa điểm vàng (AMD)',
    labelEn: 'Macular Degeneration',
    labelKm: 'ការពុកផុយនៃចំណុចកណ្តាលភ្នែក',
    descVi: 'Vùng trung tâm thị giác bị mờ đen hoặc méo mó trầm trọng, trong khi thị trường ngoại biên xung quanh vẫn bình thường.',
    descEn: 'The central area of vision becomes blurry, dark, or distorted, while peripheral vision remains relatively clear.',
    descKm: 'តំបន់កណ្តាលនៃចក្ខុវិស័យប្រែជាព្រិលខ្មៅ ឬវៀចវេរខ្លាំង ខណៈពេលដែលផ្នែកជុំវិញនៅធម្មតា។',
  },
  // 3. Mù màu
  {
    key: 'protanopia',
    category: 'color',
    filterId: '#simProtanopia',
    labelVi: 'Mù màu đỏ (Protanopia)',
    labelEn: 'Protanopia (Red-blind)',
    labelKm: 'ខ្វាក់ពណ៌ក្រហម (Protanopia)',
    descVi: 'Rối loạn sắc giác không nhận biết được ánh sáng màu đỏ, sắc đỏ chuyển thành sắc nâu/xám.',
    descEn: 'Red color blindness. Incapacity to perceive red light; reds appear brownish-gray.',
    descKm: 'អសមត្ថភាពក្នុងការមើលឃើញពណ៌ក្រហម ដោយពណ៌ក្រហមប្រែទៅជាពណ៌ត្នោត/ប្រផេះ។',
  },
  {
    key: 'deuteranopia',
    category: 'color',
    filterId: '#simDeuteranopia',
    labelVi: 'Mù màu lục (Deuteranopia)',
    labelEn: 'Deuteranopia (Green-blind)',
    labelKm: 'ខ្វាក់ពណ៌បៃតង (Deuteranopia)',
    descVi: 'Rối loạn sắc giác không nhận biết được ánh sáng màu xanh lá cây, sắc xanh lá chuyển thành sắc vàng/nâu.',
    descEn: 'Green color blindness. Incapacity to perceive green light; greens appear yellowish-brown.',
    descKm: 'អសមត្ថភាពក្នុងការមើលឃើញពណ៌បៃតង ដោយពណ៌បៃតងប្រែទៅជាពណ៌លឿង/ត្នោត។',
  },
  {
    key: 'tritanopia',
    category: 'color',
    filterId: '#simTritanopia',
    labelVi: 'Mù màu lam (Tritanopia)',
    labelEn: 'Tritanopia (Blue-blind)',
    labelKm: 'ខ្វាក់ពណ៌ខៀវ (Tritanopia)',
    descVi: 'Dạng mù màu hiếm gặp khiến người bệnh không phân biệt được màu xanh lam và màu vàng.',
    descEn: 'Rare blue-yellow color blindness. Difficulty distinguishing blue and yellow colors.',
    descKm: 'ជំងឺខ្វាក់ពណ៌ខៀវ-លឿងដែលកម្រជួប ពិបាកបែងចែកពណ៌ខៀវ និងពណ៌លឿង។',
  },
  {
    key: 'achromatopsia',
    category: 'color',
    filterId: '#simAchromatopsia',
    labelVi: 'Mù màu toàn phần',
    labelEn: 'Achromatopsia (Total)',
    labelKm: 'ខ្វាក់ពណ៌ទាំងស្រុង (Achromatopsia)',
    descVi: 'Mất hoàn toàn khả năng phân biệt màu sắc, thế giới chỉ hiển thị qua hai tông màu đen và trắng.',
    descEn: 'Total color blindness. Complete inability to perceive any color; the world appears in grayscale.',
    descKm: 'ការបាត់បង់សមត្ថភាពបែងចែកពណ៌ទាំងស្រុង ពិភពលោកបង្ហាញតែពណ៌ខ្មៅ និងស។',
  },
];

// Ảnh mẫu làm demo khi không mở được Camera
const SAMPLE_IMAGE_URL = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80';

export default function EyeSimulationPage() {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
  const [modelLoading, setModelLoading] = useState(true);
  
  // Tình trạng đang chọn
  const [selectedCondition, setSelectedCondition] = useState<EyeConditionKey>('normal');
  const [activeCategory, setActiveCategory] = useState<'refractive' | 'disease' | 'color'>('refractive');

  // Chế độ: camera thật hoặc ảnh demo
  const [useSampleMode, setUseSampleMode] = useState(false);
  const [sampleImageLoaded, setSampleImageLoaded] = useState(false);
  const sampleImgRef = useRef<HTMLImageElement | null>(null);

  // Khoảng cách ảo điều chỉnh bằng tay (khi dùng ảnh demo hoặc camera không phát hiện mặt)
  const [manualDistance, setManualDistance] = useState<number>(0.25); // 0.1 (gần) đến 0.5 (xa)
  const [detectedDistance, setDetectedDistance] = useState<number | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);

  // FPS tracking
  const [fps, setFps] = useState(0);

  // SMOOTHING_FACTOR cho khoảng cách khuôn mặt để tránh rung lắc
  const SMOOTHING_FACTOR = 0.2;
  const smoothedDistanceRef = useRef<number>(0.25);

  // Bộ dịch ngôn ngữ trực tiếp cho các thành phần UI
  const getTranslation = (key: string) => {
    const simDict: Record<string, { vi: string; en: string; km: string }> = {
      settingsTitle: {
        vi: 'Cài đặt mô phỏng',
        en: 'Simulation Settings',
        km: 'ការកំណត់ការក្លែងធ្វើ',
      },
      imageSource: {
        vi: 'Nguồn hình ảnh hiển thị:',
        en: 'Display Image Source:',
        km: 'ប្រភពរូបភាពបង្ហាញ:',
      },
      yourCamera: {
        vi: 'Camera của bạn',
        en: 'Your Camera',
        km: 'កាមេរ៉ារបស់អ្នក',
      },
      sampleImage: {
        vi: 'Ảnh mẫu phong cảnh',
        en: 'Landscape Sample',
        km: 'រូបភាពគំរូ',
      },
      simulatedDistance: {
        vi: 'Khoảng cách mắt giả lập:',
        en: 'Simulated eye distance:',
        km: 'ចម្ងាយភ្នែកសិប្បនិម្មិត:',
      },
      veryClose: {
        vi: 'Rất gần (12cm)',
        en: 'Very Close (12cm)',
        km: 'ជិតបំផុត (12cm)',
      },
      veryFar: {
        vi: 'Rất xa (48cm)',
        en: 'Very Far (48cm)',
        km: 'ឆ្ងាយបំផុត (48cm)',
      },
      aiTracking: {
        vi: '* Đang tự động theo dõi khoảng cách bằng AI camera.',
        en: '* Automatically tracking distance via AI camera.',
        km: '* តាមដានចម្ងាយដោយស្វ័យប្រវត្តិតាមរយៈកាមេរ៉ា AI។',
      },
      detectedDistanceTitle: {
        vi: 'Khoảng cách nhận diện',
        en: 'Detected Distance',
        km: 'ចម្ងាយរកឃើញ',
      },
      veryCloseLabel: {
        vi: 'Rất gần',
        en: 'Very Close',
        km: 'ជិតបំផុត',
      },
      normalLabel: {
        vi: 'Bình thường',
        en: 'Normal',
        km: 'ធម្មតា',
      },
      farLabel: {
        vi: 'Xa',
        en: 'Far',
        km: 'ឆ្ងាយ',
      },
      cameraLabel: {
        vi: 'Camera',
        en: 'Camera',
        km: 'កាមេរ៉ា',
      },
      manualLabel: {
        vi: 'Thủ công',
        en: 'Manual',
        km: 'ដោយដៃ',
      },
      footerText: {
        vi: 'Hệ thống Vista Simulation mô phỏng quang học dựa trên thuật toán tích chập camera thời gian thực.',
        en: 'Vista Simulation system simulates optical conditions based on real-time camera convolution algorithms.',
        km: 'ប្រព័ន្ធក្លែងធ្វើវីស្តា (Vista Simulation) ក្លែងធ្វើអុបទិកផ្អែកលើក្បួនដោះស្រាយការបញ្ចូលគ្នានៃកាមេរ៉ាពេលវេលាជាក់ស្តែង។',
      },
      noFaceLabel: {
        vi: '⚠️ KHÔNG THẤY MẶT (DI CHUYỂN LẠI GẦN)',
        en: '⚠️ FACE NOT DETECTED (MOVE CLOSER)',
        km: '⚠️ រកមិនឃើញមុខទេ (សូមចូលទៅជិត)',
      },
      faceDetectedLabel: {
        vi: 'ĐÃ PHÁT HIỆN MẶT',
        en: 'FACE DETECTED',
        km: 'រកឃើញមុខហើយ',
      },
      refractiveTab: {
        vi: 'Tật khúc xạ',
        en: 'Refractive',
        km: ' khúc xạ',
      },
      diseaseTab: {
        vi: 'Bệnh lý mắt',
        en: 'Eye Diseases',
        km: 'ជំងឺភ្នែក',
      },
      colorTab: {
        vi: 'Mù màu',
        en: 'Color Blind',
        km: 'ខ្វាក់ពណ៌',
      },
      knowledgeTitle: {
        vi: 'Kiến thức y khoa',
        en: 'Medical Knowledge',
        km: 'ចំណេះដឹងវេជ្ជសាស្ត្រ',
      }
    };
    return simDict[key]?.[language] || simDict[key]?.vi || key;
  };

  // Lấy nhãn tình trạng theo ngôn ngữ hiện tại
  const getConditionText = (cond: EyeCondition) => {
    if (language === 'en') return { label: cond.labelEn, desc: cond.descEn };
    if (language === 'km') return { label: cond.labelKm, desc: cond.descKm };
    return { label: cond.labelVi, desc: cond.descVi };
  };

  const currentConditionObj = eyeConditions.find((c) => c.key === selectedCondition) || eyeConditions[0];
  const { label: condLabel, desc: condDesc } = getConditionText(currentConditionObj);

  // Tải ảnh mẫu để sẵn sàng fallback
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      sampleImgRef.current = img;
      setSampleImageLoaded(true);
    };
    img.src = SAMPLE_IMAGE_URL;
  }, []);

  // Khởi tạo MediaPipe Face Landmarker
  useEffect(() => {
    let cancelled = false;
    async function initFaceLandmarker() {
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
          minFaceDetectionConfidence: 0.4,
          minFacePresenceConfidence: 0.4,
          minTrackingConfidence: 0.4,
        });
        if (!cancelled) {
          setFaceLandmarker(detector);
          setModelLoading(false);
        }
      } catch (err) {
        console.error('Failed to load face landmarker model', err);
        if (!cancelled) setModelLoading(false);
      }
    }
    initFaceLandmarker();
    return () => { cancelled = true; };
  }, []);

  // Tính độ mờ dựa trên loại tật khúc xạ và khoảng cách mặt
  // d ở đây là khoảng cách vật lý thực tế: nhỏ là GẦN, lớn là XA
  const getRefractiveBlur = (condition: EyeConditionKey, d: number) => {
    const minBlur = 0;
    const maxBlur = 18; // CSS px blur
    
    if (condition === 'myopia') {
      // Cận thị: Nhìn gần rõ (d nhỏ ➔ rõ), nhìn xa mờ (d lớn ➔ mờ)
      if (d <= 0.20) return minBlur;
      if (d >= 0.38) return maxBlur;
      return minBlur + ((d - 0.20) / (0.38 - 0.20)) * (maxBlur - minBlur);
    }
    
    if (condition === 'hyperopia') {
      // Viễn thị: Nhìn gần mờ (d nhỏ ➔ mờ), nhìn xa rõ (d lớn ➔ rõ)
      if (d <= 0.20) return maxBlur;
      if (d >= 0.38) return minBlur;
      return maxBlur - ((d - 0.20) / (0.38 - 0.20)) * (maxBlur - minBlur);
    }
    
    if (condition === 'presbyopia') {
      // Lão thị: Nhìn gần mờ (d nhỏ ➔ mờ), nhìn xa rõ (d lớn ➔ rõ)
      if (d <= 0.20) return 14;
      if (d >= 0.35) return minBlur;
      return 14 - ((d - 0.20) / (0.35 - 0.20)) * (14 - minBlur);
    }

    return minBlur;
  };

  // Quy đổi kích thước mặt từ camera (rawDist từ ~0.08 đến ~0.24) sang khoảng cách vật lý giả lập (0.48m về 0.12m)
  const getSimulatedDistance = (rawDist: number | null): number => {
    if (rawDist === null) return manualDistance;
    const minRaw = 0.08; // Xa
    const maxRaw = 0.24; // Gần (thoải mái, không cần dí sát mặt)
    const clampedRaw = Math.max(minRaw, Math.min(maxRaw, rawDist));
    const t = (clampedRaw - minRaw) / (maxRaw - minRaw);
    return 0.48 - t * (0.48 - 0.12);
  };

  // Vòng lặp vẽ chính (chạy 60 FPS)
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastVideoTime = -1;

    const render = async () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        animationId = requestAnimationFrame(render);
        return;
      }
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        animationId = requestAnimationFrame(render);
        return;
      }

      let videoElement: HTMLVideoElement | null = null;
      let isSourceReady = false;
      let srcWidth = 640;
      let srcHeight = 480;

      if (!useSampleMode && webcamRef.current) {
        videoElement = webcamRef.current.video;
        if (videoElement && videoElement.readyState === 4) {
          isSourceReady = true;
          srcWidth = videoElement.videoWidth;
          srcHeight = videoElement.videoHeight;
        }
      } else if (useSampleMode && sampleImageLoaded && sampleImgRef.current) {
        isSourceReady = true;
        srcWidth = sampleImgRef.current.width;
        srcHeight = sampleImgRef.current.height;
      }

      if (!isSourceReady) {
        animationId = requestAnimationFrame(render);
        return;
      }

      if (canvas.width !== srcWidth || canvas.height !== srcHeight) {
        canvas.width = srcWidth;
        canvas.height = srcHeight;
      }

      let currentDist = manualDistance;
      let faceFound = false;
      let physicalCameraDist = 0.25;

      if (!useSampleMode && videoElement && faceLandmarker) {
        if (videoElement.currentTime !== lastVideoTime) {
          lastVideoTime = videoElement.currentTime;
          
          try {
            const results = faceLandmarker.detectForVideo(videoElement, performance.now());
            if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
              faceFound = true;
              const face = results.faceLandmarks[0];
              const leftOuter = face[33];
              const rightOuter = face[263];
              const rawDistance = Math.abs(rightOuter.x - leftOuter.x);
              
              smoothedDistanceRef.current += (rawDistance - smoothedDistanceRef.current) * SMOOTHING_FACTOR;
              setDetectedDistance(smoothedDistanceRef.current);
            }
          } catch (e) {
            console.error('Landmark detect failed', e);
          }
          setFaceDetected(faceFound);
        }
        
        if (detectedDistance !== null) {
          physicalCameraDist = getSimulatedDistance(smoothedDistanceRef.current);
          currentDist = physicalCameraDist;
        }
      } else {
        setFaceDetected(false);
        setDetectedDistance(null);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      if (!useSampleMode) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoElement!, 0, 0, canvas.width, canvas.height);
      } else if (sampleImgRef.current) {
        ctx.drawImage(sampleImgRef.current, 0, 0, canvas.width, canvas.height);
      }
      ctx.restore();

      applyPathologyEffects(ctx, canvas, selectedCondition, currentDist, videoElement);

      animationId = requestAnimationFrame(render);
    };

    const applyPathologyEffects = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      cond: EyeConditionKey,
      dist: number,
      video: HTMLVideoElement | null
    ) => {
      const width = canvas.width;
      const height = canvas.height;

      canvas.style.filter = 'none';

      if (cond === 'normal') {
        return;
      }

      const conditionObj = eyeConditions.find((c) => c.key === cond);
      if (conditionObj && conditionObj.category === 'color' && conditionObj.filterId) {
        canvas.style.filter = `url('${conditionObj.filterId}')`;
        return;
      }

      if (cond === 'myopia' || cond === 'hyperopia' || cond === 'presbyopia') {
        const blurAmt = getRefractiveBlur(cond, dist);
        canvas.style.filter = `blur(${blurAmt.toFixed(1)}px)`;
        return;
      }

      if (cond === 'astigmatism') {
        ctx.save();
        ctx.globalAlpha = 0.35;
        canvas.style.filter = 'blur(1.5px)';
        if (!useSampleMode && video) {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, 6, 6, width, height);
        } else if (sampleImgRef.current) {
          ctx.drawImage(sampleImgRef.current, 6, 6, width, height);
        }
        ctx.restore();
        return;
      }

      if (cond === 'strabismus') {
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.globalAlpha = 0.6;
        if (!useSampleMode && video) {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, -15, 0, width, height);
          ctx.drawImage(video, 15, 0, width, height);
        } else if (sampleImgRef.current) {
          ctx.drawImage(sampleImgRef.current, -15, 0, width, height);
          ctx.drawImage(sampleImgRef.current, 15, 0, width, height);
        }
        ctx.restore();
        canvas.style.filter = 'blur(0.8px)';
        return;
      }

      if (cond === 'cataract') {
        canvas.style.filter = 'blur(5px) contrast(0.65) saturate(0.8)';
        ctx.save();
        ctx.fillStyle = 'rgba(235, 190, 80, 0.12)';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        return;
      }

      if (cond === 'glaucoma') {
        ctx.save();
        const centerX = width / 2;
        const centerY = height / 2;
        const innerRadius = Math.min(width, height) * 0.12;
        const outerRadius = Math.min(width, height) * 0.45;

        const maskGrad = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius);
        maskGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        maskGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.2)');
        maskGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.85)');
        maskGrad.addColorStop(1, 'rgba(0, 0, 0, 0.98)');

        ctx.fillStyle = maskGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        canvas.style.filter = 'blur(0.5px)';
        return;
      }

      if (cond === 'macular') {
        ctx.save();
        const centerX = width / 2;
        const centerY = height / 2;
        const innerRadius = Math.min(width, height) * 0.04;
        const outerRadius = Math.min(width, height) * 0.22;

        const spotGrad = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius);
        spotGrad.addColorStop(0, 'rgba(15, 15, 15, 0.95)');
        spotGrad.addColorStop(0.4, 'rgba(25, 25, 25, 0.85)');
        spotGrad.addColorStop(0.7, 'rgba(40, 40, 40, 0.4)');
        spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [useSampleMode, faceLandmarker, selectedCondition, manualDistance, detectedDistance, sampleImageLoaded]);

  const filteredConditions = eyeConditions.filter((c) => c.category === activeCategory);

  return (
    <div className="fixed inset-0 bg-slate-950 text-white overflow-hidden select-none flex flex-col md:flex-row">
      <svg className="absolute w-0 h-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="simProtanopia" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0" />
          </filter>
          <filter id="simDeuteranopia" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0,1,0,0 0,0,0,1,0" />
          </filter>
          <filter id="simTritanopia" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" />
          </filter>
          <filter id="simAchromatopsia" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.213,0.715,0.072,0,0 0.213,0.715,0.072,0,0 0.213,0.715,0.072,0,0 0,0,0,1,0" />
          </filter>
        </defs>
      </svg>

      {/* CỘT TRÁI: CAMERA VIEWPORT */}
      <div className="flex-grow relative h-[60%] md:h-full bg-black flex items-center justify-center overflow-hidden">
        {!useSampleMode && (
          <div className="absolute opacity-0 w-1 h-1 pointer-events-none">
            <Webcam
              ref={webcamRef}
              mirrored={true}
              videoConstraints={{
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 },
              }}
            />
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-all duration-300"
        />

        <div className="absolute top-4 left-4 z-40 flex items-center gap-3">
          <button
            onClick={() => navigate('/knowledge')}
            className="px-4 py-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center gap-2 backdrop-blur-md border border-white/10 shadow-2xl active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t('knowledge.backHome') || 'Quay lại'}</span>
          </button>

          {/* Nút chuyển ngữ */}
          <div className="flex gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-2xl">
            {(['vi', 'en', 'km'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all uppercase
                  ${language === lang 
                    ? 'bg-sky-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                  }
                `}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute top-4 right-4 z-40 flex flex-col gap-2 items-end">
          {faceDetected && !useSampleMode && (
            <div className="bg-emerald-500/90 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-lg border border-emerald-400/20 flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              {getTranslation('faceDetectedLabel')}
            </div>
          )}
          {!faceDetected && !useSampleMode && !modelLoading && (
            <div className="bg-amber-500/95 text-slate-950 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-lg border border-amber-400/20 flex items-center gap-1">
              {getTranslation('noFaceLabel')}
            </div>
          )}
          <div className="bg-slate-900/80 backdrop-blur-md text-slate-400 text-[10px] font-mono px-2.5 py-1 rounded border border-white/5">
            FPS: <span className="text-white font-bold">{fps}</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 z-40 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold max-w-xs shadow-2xl">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            {getTranslation('detectedDistanceTitle')}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
            <span>
              {detectedDistance !== null 
                ? `${getTranslation('cameraLabel')}: ${(getSimulatedDistance(detectedDistance) * 100).toFixed(0)}cm (${getSimulatedDistance(detectedDistance) < 0.22 ? getTranslation('veryCloseLabel') : getSimulatedDistance(detectedDistance) > 0.38 ? getTranslation('farLabel') : getTranslation('normalLabel')})`
                : `${getTranslation('manualLabel')}: ${(manualDistance * 100).toFixed(0)}cm`
              }
            </span>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: BẢNG ĐIỀU KHIỂN */}
      <div className="w-full md:w-[380px] lg:w-[420px] h-[40%] md:h-full bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col z-30">
        <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <button
            onClick={() => setActiveCategory('refractive')}
            className={`py-3.5 text-center text-xs font-black uppercase tracking-wider transition-all border-b-2
              ${activeCategory === 'refractive' 
                ? 'border-sky-500 text-sky-400 bg-sky-500/5' 
                : 'border-transparent text-slate-400 hover:text-white'
              }
            `}
          >
            {getTranslation('refractiveTab')}
          </button>
          <button
            onClick={() => setActiveCategory('disease')}
            className={`py-3.5 text-center text-xs font-black uppercase tracking-wider transition-all border-b-2
              ${activeCategory === 'disease' 
                ? 'border-sky-500 text-sky-400 bg-sky-500/5' 
                : 'border-transparent text-slate-400 hover:text-white'
              }
            `}
          >
            {getTranslation('diseaseTab')}
          </button>
          <button
            onClick={() => setActiveCategory('color')}
            className={`py-3.5 text-center text-xs font-black uppercase tracking-wider transition-all border-b-2
              ${activeCategory === 'color' 
                ? 'border-sky-500 text-sky-400 bg-sky-500/5' 
                : 'border-transparent text-slate-400 hover:text-white'
              }
            `}
          >
            {getTranslation('colorTab')}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin">
          <div className="grid grid-cols-2 gap-2">
            {filteredConditions.map((cond) => {
              const isSelected = selectedCondition === cond.key;
              return (
                <button
                  key={cond.key}
                  onClick={() => setSelectedCondition(cond.key)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col justify-center items-center min-h-[54px] active:scale-[0.98]
                    ${isSelected 
                      ? 'bg-sky-600 border-sky-500 text-white shadow-md shadow-sky-600/20' 
                      : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white'
                    }
                  `}
                >
                  {language === 'en' ? cond.labelEn : language === 'km' ? cond.labelKm : cond.labelVi}
                </button>
              );
            })}
          </div>

          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-sky-400">
              {getTranslation('knowledgeTitle')}
            </h4>
            <div className="text-sm font-bold text-slate-100">
              {condLabel}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              {condDesc}
            </p>
          </div>

          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-sky-400">
              {getTranslation('settingsTitle')}
            </h4>

            {/* Bộ chọn nguồn mô phỏng - Dạng Tab phân biệt trực quan */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 block">
                {getTranslation('imageSource')}
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setUseSampleMode(false)}
                  className={`py-2 px-3 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5
                    ${!useSampleMode 
                      ? 'bg-sky-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }
                  `}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {getTranslation('yourCamera')}
                </button>
                <button
                  onClick={() => setUseSampleMode(true)}
                  className={`py-2 px-3 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5
                    ${useSampleMode 
                      ? 'bg-sky-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }
                  `}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {getTranslation('sampleImage')}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>{getTranslation('simulatedDistance')}</span>
                <span className="text-white font-mono">{((detectedDistance !== null ? getSimulatedDistance(detectedDistance) : manualDistance) * 100).toFixed(0)}cm</span>
              </div>
              <input
                type="range"
                min="0.12"
                max="0.48"
                step="0.01"
                value={detectedDistance !== null ? getSimulatedDistance(detectedDistance) : manualDistance}
                disabled={detectedDistance !== null}
                onChange={(e) => setManualDistance(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500 disabled:opacity-50"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                <span>{getTranslation('veryClose')}</span>
                <span>{getTranslation('veryFar')}</span>
              </div>
              {detectedDistance !== null && (
                <p className="text-[10px] text-emerald-400 font-bold">
                  {getTranslation('aiTracking')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-center shrink-0">
          <p className="text-[10px] text-slate-500 font-semibold leading-normal">
            {getTranslation('footerText')}
          </p>
        </div>
      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
