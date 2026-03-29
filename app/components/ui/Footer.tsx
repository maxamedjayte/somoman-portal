import Link from "next/link";

export default function Footer() {
    return (
        <footer
            id="contact"
            className="bg-[#003527] text-white"
        >
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
                <div className="flex flex-col items-center justify-between gap-5 rounded-[30px] bg-white/6 px-5 py-6 text-center backdrop-blur-sm md:flex-row md:text-left">
                    <div>
                        <h3 className="text-2xl font-extrabold">SomOman</h3>
                        <p className="mt-2 text-sm text-white/70">
                            Adeegyadaada Cumaan si fudud oo casri ah.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/75">
                        <Link href="/">Privacy</Link>
                        <Link href="/">Terms</Link>
                        <Link href="/">Contact</Link>
                    </div>
                </div>

                <div className="mt-5 flex flex-col items-center justify-between gap-3 text-center text-sm text-white/65 md:flex-row md:text-left">
                    <p>© 2026 SomOman. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/">Facebook</Link>
                        <Link href="/">Instagram</Link>
                        <Link href="/">WhatsApp</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}