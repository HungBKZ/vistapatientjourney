import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function LandingPage() {
    const { t } = useLanguage();

    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            const res = await fetch("https://your-api-endpoint.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!res.ok) {
                throw new Error("Login failed");
            }

            const data = await res.json();

            // ví dụ: lưu token
            localStorage.setItem("token", data.token);

            // redirect sau login
            window.location.href = "/dashboard";
        } catch (err) {
            alert("Login failed!");
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
                    onClick={() => setIsOpen(false)}   // click ngoài => đóng modal
                >
                    <div
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()} // click trong modal => không đóng
                    >
                        <h2 className="mb-4 text-xl font-bold text-slate-800">
                            Login
                        </h2>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                type="email"
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
                                className="w-full rounded-lg bg-cyan-600 p-3 font-semibold text-white hover:bg-cyan-700"
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
                <img
                    src="/eye.jpg"
                    alt="Retinal Image"
                    className="
            absolute inset-0
            h-full w-full
            object-cover

            object-[72%_center]
            sm:object-[70%_center]
            md:object-[72%_center]
            lg:object-[75%_center]
            xl:object-[72%_center]
            "
                />

                {/* Overlay */}
                <div
                    className="
            absolute inset-0

            bg-gradient-to-r
            from-white
            via-white/95
            to-white/50

            md:from-white/95
            md:via-white/85
            md:to-cyan-100/20
            "
                />

                {/* Glow Effect */}
                <div
                    className="
            absolute
            left-0
            top-1/2
            -translate-y-1/2

            h-48 w-48
            sm:h-64 sm:w-64
            lg:h-80 lg:w-80

            rounded-full
            bg-cyan-300/20
            blur-3xl
            "
                />

                {/* Content */}
                <div
                    className="
            relative z-10
            mx-auto
            flex
            min-h-screen
            max-w-7xl
            items-center

            px-5
            sm:px-8
            lg:px-12
            "
                >
                    <div className="max-w-xl lg:max-w-2xl">
                        {/* Badge */}
                        <span
                            className="
                inline-flex
                rounded-full
                border border-cyan-200
                bg-white/80
                px-3 py-2
                sm:px-4

                text-xs
                sm:text-sm

                font-medium
                text-cyan-700
                backdrop-blur
                "
                        >
                            {t("diagnosis.badge")}
                        </span>

                        {/* Title */}
                        <h1
                            className="
                mt-5
                font-bold
                leading-tight
                text-slate-900

                text-4xl
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
                "
                        >
                            {t("diagnosis.title")}
                            <br />
                            {t("diagnosis.titleLine2")}
                        </h1>

                        {/* Description */}
                        <p
                            className="
                mt-5
                max-w-lg

                text-base
                sm:text-lg

                leading-relaxed
                text-slate-600
                "
                        >
                            {t("diagnosis.description")}
                        </p>

                        {/* Buttons */}
                        <div
                            className="
                mt-8
                flex
                flex-col
                gap-3

                sm:flex-row
                "
                        >
                            <button
                                onClick={() => setIsOpen(true)}
                                className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-cyan-700"
                            >
                                {t("diagnosis.tryDemo")}
                            </button>
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
                                src="/feature-2.jpg"
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
                                src="/feature-3.png"
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