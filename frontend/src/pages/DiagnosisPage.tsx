import { useState, useRef } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useLanguage } from "../contexts/LanguageContext";
import { isTokenValid } from "@/utils/auth";

export default function LandingPage() {
    const { t, language } = useLanguage();

    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Xử lý khi click "Dùng thử"
    const handleTryDemo = () => {
        if (isTokenValid()) {
            // Có token và còn hạn => Chuyển luôn tới trang sử dụng
            window.location.href = "/diagnosis-service";
        } else {
            // Chưa có token hoặc hết hạn => Xóa token cũ (nếu có) và Mở Modal login
            Cookies.remove("token");
            setIsOpen(true);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("https://api.vistapatientjourney.vn/auth/testing", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error("Login failed");
            }
            console.log("1")
            // Xử lý dữ liệu trả về
            const data = await res.text();
            console.log("2")

            let tokenStr = data;
            try {
                const parsed = JSON.parse(data);
                if (parsed && typeof parsed === "object" && parsed.token) {
                    tokenStr = parsed.token;
                }
            } catch (e) {
                // data không phải là JSON, giữ nguyên tokenStr là plain text
            }

            console.log("wiuefhwueifh")
            console.log(tokenStr)

            // Phân tích token để lấy hạn sử dụng (exp) cài đặt cho Cookie
            const decoded: any = jwtDecode(tokenStr);
            const expires = new Date(decoded.exp * 1000); // Chuyển từ giây sang mili-giây

            // Lưu token vào cookie, set thời gian sống đúng bằng token
            Cookies.set("token", tokenStr, { expires });

            // redirect sau khi login thành công
            window.location.href = "/diagnosis-service";
        } catch (err) {
            alert("Đăng nhập thất bại. Vui lòng kiểm tra lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* ===== MODAL ===== */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="mb-4 text-xl font-bold text-slate-800">Login</h2>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                // type="email" ============================================ tạm bỏ type Email
                                placeholder="Email"
                                className="w-full rounded-lg border p-3"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full rounded-lg border p-3"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-cyan-600 p-3 font-semibold text-white hover:bg-cyan-700 disabled:opacity-50"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-3 w-full text-sm text-gray-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <section className="relative min-h-screen overflow-hidden">
                {/* Background Image */}
                <img src="/eye.jpg" alt="Retinal Image" className="absolute inset-0 h-full w-full object-cover object-[72%_center] sm:object-[70%_center] md:object-[72%_center] lg:object-[75%_center] xl:object-[72%_center]" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/50 md:from-white/95 md:via-white/85 md:to-cyan-100/20" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-48 w-48 sm:h-64 sm:w-64 lg:h-80 lg:w-80 rounded-full bg-cyan-300/20 blur-3xl" />

                <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-5 sm:px-8 lg:px-12">
                    <div className="max-w-xl lg:max-w-2xl">
                        {/* Badge */}
                        <span className="inline-flex rounded-full border border-cyan-200 bg-white/80 px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-cyan-700 backdrop-blur">{t("diagnosis.badge")}</span>
                        <h1 className="mt-5 font-bold leading-tight text-slate-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                            {t("diagnosis.title")}<br />{t("diagnosis.titleLine2")}
                        </h1>
                        <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-slate-600">
                            {t("diagnosis.description")}
                        </p>

                        {/* Nút "Dùng thử" sử dụng logic mới */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={handleTryDemo} // Đã thay đổi ở đây
                                className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-cyan-700"
                            >
                                {t("diagnosis.tryDemo")}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== VIDEO DEMO SECTION ===== */}
            <section className="relative bg-slate-900 py-20 overflow-hidden">
                {/* Background decorative glows */}
                <div className="absolute top-1/4 left-1/4 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-4">
                            Interactive Demo
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                            {language === "vi"
                                ? "Xem Trải Nghiệm Demo Hệ Thống"
                                : language === "km"
                                    ? "វីដេអូបង្ហាញពីប្រព័ន្ធ"
                                    : "System Demo Experience"}
                        </h2>
                        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            {language === "vi"
                                ? "Khám phá cách thức trí tuệ nhân tạo hỗ trợ các chuyên gia y tế chẩn đoán, khoanh vùng tổn thương võng mạc và lập báo cáo chi tiết."
                                : language === "km"
                                    ? "ស្វែងយល់ពីរបៀបដែល AI ជួយវិនិច្ឆ័យជំងឺភ្នែក ដៅតំបន់ដែលខូចខាត និងបង្កើតរបាយការណ៍លម្អិត។"
                                    : "Explore how our AI model assists healthcare professionals in detecting lesions, segmenting affected areas, and generating comprehensive reports."}
                        </p>
                    </div>

                    {/* Desktop/Tablet Device Mockup */}
                    <div className="relative mx-auto max-w-4xl">
                        {/* Glowing backdrop border effect */}
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-30 blur-lg transition duration-1000 group-hover:opacity-100 pointer-events-none shadow-[0_0_50px_rgba(6,182,212,0.15)]" />

                        {/* The Mockup Box */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/80 shadow-2xl backdrop-blur-xl">
                            {/* Browser/System Bar */}
                            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 py-3">
                                <div className="flex space-x-2">
                                    <div className="h-3.5 w-3.5 rounded-full bg-red-500/80" />
                                    <div className="h-3.5 w-3.5 rounded-full bg-yellow-500/80" />
                                    <div className="h-3.5 w-3.5 rounded-full bg-green-500/80" />
                                </div>
                                <div className="hidden sm:block text-xs font-mono text-slate-500 bg-slate-950/50 px-6 py-1 rounded-md border border-slate-800/40">
                                    https://vistapatientjourney.vn/diagnosis-demo
                                </div>
                                <div className="w-12" /> {/* Spacer */}
                            </div>

                            {/* Video Display Container */}
                            <div className="relative aspect-video w-full bg-black">
                                <video
                                    ref={videoRef}
                                    className="h-full w-full object-cover"
                                    src="https://res.cloudinary.com/dvucotc8z/video/upload/v1782282656/0624_iu2dl0.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />

                                {/* Glassmorphic Controls Bar */}
                                <div className="absolute bottom-4 right-4 flex items-center gap-3 rounded-xl bg-slate-900/85 p-2.5 text-white backdrop-blur-md border border-slate-700/50 shadow-lg">
                                    <button
                                        onClick={toggleMute}
                                        className="flex items-center justify-center p-2 rounded-lg bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white transition duration-200"
                                        title={isMuted ? "Unmute" : "Mute"}
                                    >
                                        {isMuted ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.5 9H1.5v6h3l4.5 3.75V5.25z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28-5.3v15.88a.75.75 0 01-1.28-.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative min-h-screen w-full">
                <div
                    className="
                absolute
                -top-32
                left-0
                h-32
                w-full
                bg-gradient-to-b
                from-transparent
                to-white
                pointer-events-none
                "
                />
                <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6">
                    <div className="grid w-full gap-8 md:grid-cols-3">

                        {/* Card 1 */}
                        <div className="rounded-3xl bg-white/80 p-5 shadow-lg backdrop-blur-sm">
                            <img
                                src="/feature-1.png"
                                alt="Detection"
                                className="mb-5 h-64 w-full rounded-2xl object-cover"
                            />

                            <h3 className="mb-3 text-xl font-bold text-slate-800">
                                {t("diagnosis.features.detection.title")}
                            </h3>

                            <p className="text-sm leading-relaxed text-slate-600">
                                {t("diagnosis.features.detection.description")}
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="rounded-3xl bg-white/80 p-5 shadow-lg backdrop-blur-sm">
                            <img
                                src="/feature-2.png"
                                alt="Diagnosis"
                                className="mb-5 h-64 w-full rounded-2xl object-cover"
                            />

                            <h3 className="mb-3 text-xl font-bold text-slate-800">
                                {t("diagnosis.features.diagnosis.title")}
                            </h3>

                            <p className="text-sm leading-relaxed text-slate-600">
                                {t("diagnosis.features.diagnosis.description")}
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="rounded-3xl bg-white/80 p-5 shadow-lg backdrop-blur-sm">
                            <img
                                src="/feature-3.jpg"
                                alt="Classification"
                                className="mb-5 h-64 w-full rounded-2xl object-cover"
                            />

                            <h3 className="mb-3 text-xl font-bold text-slate-800">
                                {t("diagnosis.features.classification.title")}
                            </h3>

                            <p className="text-sm leading-relaxed text-slate-600">
                                {t("diagnosis.features.classification.description")}
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}