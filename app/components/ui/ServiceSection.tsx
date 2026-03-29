import ServiceCard from "./ServiceCard";

const services = [
    {
        title: "Fiisaha & Socdaalka",
        description: "Ka hel fiisahaaga Oman si degdeg ah.",
        image:
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
        checklist: [
            "Hel fiis joogto ah",
            "Nashaa fii & siraasmiyat",
            "Hagid tallaabo tallaabo",
        ],
    },
    {
        title: "Degitaannka",
        description: "Huteelo iyo guryo ku habboon qoyska.",
        image:
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80",
        checklist: [
            "Guryo iyo villa",
            "Hoyga qoysaska",
            "Taageero dejitaan",
        ],
    },
    {
        title: "Ganacsiga",
        description: "Maalgashiga iyo fursadaha ganacsi.",
        image:
            "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
        checklist: [
            "Fur shirkad",
            "Hel shatiyo",
            "Xog suuqeed cad",
        ],
    },
    {
        title: "Waxbarashada",
        description: "Jaamacadaha iyo tababarrada farsamo.",
        image:
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
        checklist: [
            "Diiwaangelin sahlan",
            "Xulashooyin badan",
            "Taageero joogto ah",
        ],
    },
    {
        title: "Adeegyada Qoyska",
        description: "Taageero nololeed iyo habayn qoys.",
        image:
            "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80",
        checklist: [
            "Dugsiga carruurta",
            "Daryeel qoys",
            "La qabsiga deegaanka",
        ],
    },
    {
        title: "La-talin Toos ah",
        description: "Wac ama WhatsApp nagala soo xiriir 24/7.",
        image:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
        checklist: [
            "Wac iyo WhatsApp",
            "Jawaab degdeg ah",
            "Taageero 24 saacadood",
        ],
    },
];

export default function ServiceSection() {
    return (
        <section className="bg-[#f3f4f5] py-10 md:py-14">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="mb-3 md:mb-3">
                    {/* <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#4059aa]">
                        Arag dhammaan
                    </p> */}
                    <div className="flex items-end justify-between gap-4">
                        <h2 className="max-w-lg text-3xl font-extrabold leading-tight tracking-[-0.02em] text-[#191c1d] md:text-3xl">
                            Adeegyada SomOmaan
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                    {services.map((service) => (
                        <ServiceCard key={service.title} {...service} />
                    ))}
                </div>
            </div>
        </section>
    );
}