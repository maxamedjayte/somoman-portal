import ServiceCard from "./ServiceCard";
import type { Service } from "@/app/lib/supabase/types";

type ServiceSectionProps = {
    services: Service[];
};

export default function ServiceSection({ services }: ServiceSectionProps) {
    return (
        <section className="bg-[#f3f4f5] py-10 md:py-14">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-extrabold leading-tight tracking-[-0.02em] text-[#191c1d] md:text-2xl">
                            Adeegyada SomOmaan
                        </h2>
                        <p className="text-sm text-[#191c1d]/65 md:text-base">
                            Dooro adeegga aad u baahan tahay oo bilow codsigaaga
                        </p>
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