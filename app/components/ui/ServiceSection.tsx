import ServiceCard from "./ServiceCard";
import type { Service } from "@/app/lib/supabase/types";

type ServiceSectionProps = {
    services: Service[];
};

export default function ServiceSection({ services }: ServiceSectionProps) {
    return (
        <section className="bg-[#f3f4f5] py-10 md:py-14">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="mb-3 md:mb-3">
                    <div className="flex items-end justify-between gap-4">
                        <h2 className="max-w-lg text-3xl font-extrabold leading-tight tracking-[-0.02em] text-[#191c1d] md:text-3xl">
                            Adeegyada SomOmaan
                        </h2>
                    </div>
                </div>

                {services.length === 0 ? (
                    <div className="rounded-xl bg-white px-6 py-12 text-center">
                        <p className="text-sm text-[#191c1d]/60">
                            Adeegyo ma jiraan hadda. Fadlan soo laabo mar dambe.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                        {services.map((service) => (
                            <ServiceCard key={service.id} {...service} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}