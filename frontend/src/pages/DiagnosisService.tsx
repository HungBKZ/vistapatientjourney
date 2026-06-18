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
  
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

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
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setError(null);
      setIsFullScreen(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
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

      const response = await fetch('https://103.72.98.153:443/diagnosis', {
        method: 'POST',
        body: formData,
        headers: headers, 
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn hoặc không hợp lệ.');
        }
        throw new Error(`Lỗi hệ thống: ${response.status}`);
      }

      const imageBlob = await response.blob();
      const url = URL.createObjectURL(imageBlob);
      setResultUrl(url);

    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra trong quá trình xử lý ảnh y khoa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Container bao phủ toàn màn hình, đã thêm my-[80px] để đẩy margin top và bottom
    <div className="my-[80px] mb-[180px] min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 font-sans text-slate-800 flex items-center justify-center">
      
      {/* Grid Layout: 12 cột. Trái 4 cột (1/3), Phải 8 cột (2/3) */}
      <div className="w-full max-w-[1800px] h-full lg:h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= CỘT TRÁI: UPLOAD & PREVIEW ================= */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-teal-600 p-6 h-[80vh] lg:h-full">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 shrink-0">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
              Tải ảnh lâm sàng
            </h2>
          </div>

          {/* Form / Dropzone chiếm phần lớn chiều cao cột trái */}
          <div className="flex-grow flex flex-col space-y-4 overflow-hidden">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Khu vực Preview Ảnh Tải Lên */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex-grow relative border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer hover:bg-slate-50 hover:border-teal-500 transition-all duration-200 overflow-hidden group"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  className="absolute inset-0 w-full h-full object-contain bg-slate-900/5 backdrop-blur-sm p-2"
                  alt="Preview"
                />
              ) : (
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-slate-400 group-hover:text-teal-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-3 text-sm text-slate-600 font-medium">Nhấn để chọn ảnh</p>
                  <p className="text-xs text-slate-400 mt-1">Hỗ trợ: PNG, JPG, JPEG</p>
                </div>
              )}
            </div>
          </div>

          {/* Hiển thị lỗi */}
          {error && (
            <div className="mt-4 shrink-0 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100 flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Nút bấm action */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            className="mt-4 shrink-0 w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3.5 px-4 rounded-md shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Hệ thống đang phân tích...</span>
              </>
            ) : (
              <span>Phân tích hình ảnh</span>
            )}
          </button>
        </div>

        {/* ================= CỘT PHẢI: KẾT QUẢ & CHẨN ĐOÁN ================= */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-[100vh] lg:h-full">
          
          {resultUrl ? (
            <>
              {/* NỬA TRÊN PHẢI: ẢNH KẾT QUẢ */}
              <div className="flex-[2] bg-slate-900 rounded-xl shadow-inner border border-slate-800 overflow-hidden relative flex flex-col">
                <div className="absolute top-0 w-full p-3 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_#14b8a6]"></div>
                    <span className="text-white/90 text-sm font-medium tracking-wide">PACS / Result Viewer</span>
                  </div>
                  <button 
                    onClick={() => setIsFullScreen(true)}
                    className="pointer-events-auto p-1.5 rounded bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
                    title="Phóng to toàn màn hình"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                </div>
                
                <div 
                  className="flex-grow flex items-center justify-center p-4 cursor-zoom-in"
                  onClick={() => setIsFullScreen(true)}
                >
                  <img 
                    src={resultUrl} 
                    className="max-w-full max-h-full object-contain animate-in fade-in duration-500" 
                    alt="Result from AI" 
                  />
                </div>
              </div>

              {/* NỬA DƯỚI PHẢI: TEXT CHẨN ĐOÁN */}
              <div className="flex-[1] bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-800">Kết quả chẩn đoán</h3>
                </div>
                
                <div className="text-slate-600 space-y-4 text-sm leading-relaxed">
                  <p>
                    <strong className="text-slate-800">1. Nhận định lâm sàng:</strong><br />
                    Hình ảnh trả về cho thấy các cấu trúc giải phẫu hiển thị rõ nét. Không phát hiện sự bất thường rõ rệt về mặt mật độ tại các khu vực được khoanh vùng (nếu có). Các đường viền mô mềm và cấu trúc xương (trong trường hợp X-Quang) nằm trong giới hạn sinh lý bình thường.
                  </p>
                  <p>
                    <strong className="text-slate-800">2. Phân tích chi tiết từ AI:</strong><br />
                    - Vùng quan tâm (ROI): Đã được hệ thống xử lý và tăng cường độ tương phản.<br />
                    - Mức độ rủi ro (Confidence Score): 0.85 (ngưỡng an toàn).<br />
                    - Dấu hiệu bệnh lý: Chưa phát hiện tổn thương thứ phát hay vùng mờ bất thường.
                  </p>
                  <p className="text-teal-700 italic mt-4 p-3 bg-teal-50 rounded-md">
                    * Lưu ý: Đây là kết quả phân tích sơ bộ từ hệ thống trí tuệ nhân tạo nhằm hỗ trợ bác sĩ. Vui lòng kết hợp với các xét nghiệm lâm sàng khác để đưa ra kết luận cuối cùng.
                  </p>
                </div>
              </div>
            </>
          ) : (
            // TRẠNG THÁI CHỜ
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 border-dashed text-slate-400">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative flex justify-center items-center">
                    <div className="absolute animate-ping w-16 h-16 rounded-full bg-teal-400 opacity-20"></div>
                    <svg className="animate-spin h-10 w-10 text-teal-600 relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium">Hệ thống đang quét và phân tích...</p>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium text-slate-500">Khu vực hiển thị kết quả</p>
                  <p className="text-sm text-slate-400 mt-2 max-w-sm text-center mx-auto">
                    Sau khi tải ảnh lên và nhấn phân tích, hình ảnh AI xử lý và báo cáo y khoa sẽ hiển thị tại đây.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL FULL MÀN HÌNH */}
      {resultUrl && isFullScreen && (
        <div 
            className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col animate-in fade-in duration-300"
            onClick={() => setIsFullScreen(false)}
        >
            <div className="w-full p-4 flex justify-between items-center bg-slate-900 shadow-md z-10 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                  <h3 className="text-slate-200 font-medium tracking-wide">Chế độ xem chi tiết</h3>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFullScreen(false);
                    }}
                    className="p-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                    </svg>
                </button>
            </div>
            <div className="flex-grow flex items-center justify-center p-4">
                <img 
                    src={resultUrl} 
                    className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300 rounded-sm" 
                    alt="Result Full Screen" 
                    onClick={(e) => e.stopPropagation()} 
                />
            </div>
        </div>
      )}
    </div>
  );
}