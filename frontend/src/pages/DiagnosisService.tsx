import React, { useState, useRef, useEffect } from 'react';

// Hàm helper để lấy giá trị cookie theo tên
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null; // An toàn cho Next.js SSR
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export default function ImageDiagnosis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State mới để quản lý chế độ xem full màn hình
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dọn dẹp URL khi component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  // Ngăn chặn cuộn trang khi đang xem ảnh full màn hình
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullScreen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      // Thu hồi URL cũ nếu có để tránh rò rỉ bộ nhớ
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setError(null);
      setIsFullScreen(false); // Đóng chế độ full màn hình nếu đang mở
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    // Thu hồi URL kết quả cũ nếu có
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = getCookie('token');
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`; 
      } else {
        console.warn('Không tìm thấy token trong cookie!');
      }

      const response = await fetch('http://103.72.98.153:80/diagnosis', {
        method: 'POST',
        body: formData,
        headers: headers, 
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn hoặc không hợp lệ.');
        }
        throw new Error(`Lỗi server: ${response.status}`);
      }

      const imageBlob = await response.blob();
      const url = URL.createObjectURL(imageBlob);
      setResultUrl(url);
      
      // TỰ ĐỘNG MỞ FULL MÀN HÌNH KHI CÓ KẾT QUẢ
      // Nếu bạn muốn user tự click mới mở thì comment dòng dưới lại
      setIsFullScreen(true); 

    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra trong quá trình chẩn đoán.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Container chính với class relative để làm mốc cho Modal nếu cần
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gray-50 font-sans text-gray-800">
      
      {/* 1. GIAO DIỆN UPload CHÍNH (Giữ nguyên max-w-lg) */}
      <div className={`bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 max-w-lg w-full transition-opacity duration-300 ${isFullScreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Phân tích Hình ảnh
        </h2>

        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Khu vực Dropzone/Preview ảnh upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center h-64 bg-gray-50 cursor-pointer hover:bg-gray-100 hover:border-blue-500 transition-all duration-200 overflow-hidden group"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                className="absolute inset-0 w-full h-full object-contain bg-black/5 backdrop-blur-sm"
                alt="Preview"
              />
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm text-gray-500 font-medium">Nhấn để chọn ảnh</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG</p>
              </div>
            )}
          </div>
        </div>

        {/* Hiển thị lỗi */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Nút bấm action */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <span>Đang xử lý...</span>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </>
          ) : (
            <span>Chẩn đoán</span>
          )}
        </button>

        {/* Khu vực Kết quả (Thu nhỏ, Click để phóng to) */}
        {resultUrl && !isFullScreen && (
          <div className="mt-8 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Kết quả trả về
                </h3>
                <button 
                    onClick={() => setIsFullScreen(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Xem full màn hình
                </button>
            </div>
            
            <div 
                onClick={() => setIsFullScreen(true)} // Click vào ảnh nhỏ cũng mở to
                className="rounded-2xl overflow-hidden shadow-sm border-2 border-gray-100 bg-gray-50 flex items-center justify-center min-h-[16rem] cursor-zoom-in hover:border-blue-300 transition-colors"
            >
              <img src={resultUrl} className="w-full h-full object-contain" alt="Result thumbnail" />
            </div>
          </div>
        )}
      </div>

      {/* 2. MODAL OVERLAY HIỂN THỊ ẢNH FULL MÀN HÌNH */}
      {resultUrl && isFullScreen && (
        <div 
            className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-in fade-in duration-300Mode"
            onClick={() => setIsFullScreen(false)} // Click ra ngoài ảnh để đóng
        >
            {/* Thanh header của Modal (chứa nút đóng) */}
            <div className="w-full p-4 flex justify-between items-center bg-black/50 backdrop-blur-sm z-10">
                <h3 className="text-white font-medium">Kết quả chẩn đoán chi tiết</h3>
                
                {/* Nút đóng (X) */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài gây đóng modal nhầm
                        setIsFullScreen(false);
                    }}
                    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    aria-label="Đóng xem ảnh"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                    </svg>
                </button>
            </div>

            {/* Khu vực chứa ảnh chính - chiếm hết phần còn lại của màn hình */}
            <div className="flex-grow flex items-center justify-center p-2 md:p-4">
                <img 
                    src={resultUrl} 
                    className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300" 
                    alt="Result Full Screen" 
                    onClick={(e) => e.stopPropagation()} // Click vào chính bức ảnh thì KHÔNG đóng modal
                />
            </div>
        </div>
      )}
    </div>
  );
}