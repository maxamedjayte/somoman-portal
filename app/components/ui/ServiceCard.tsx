import Link from "next/link";

type ServiceCardProps = {
    id: string;
    title: string;
    description: string;
    image: string;
    checklist: string[];
};

export default function ServiceCard({
    id,
    title,
    description,
    image,
    checklist,
}: ServiceCardProps) {
    return (
        <article className="overflow-hidden rounded-xl bg-white shadow-[0_18px_40px_rgba(25,28,29,0.05)] transition hover:-translate-y-1">
            <div className="relative aspect-[16/10] overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="space-y-3 px-4 pb-4 pt-4 md:px-5">
                <div>
                    <h3 className="text-[1.05rem] font-bold leading-tight text-[#191c1d]">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#191c1d]/65">
                        {description}
                    </p>
                </div>

                <ul className="space-y-2">
                    {checklist.map((item) => (
                        <li
                            key={item}
                            className="flex items-start gap-2 text-sm leading-5 text-[#191c1d]/78"
                        >
                            <span className="mt-0.5 text-[#d49b2b]">✔</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>

                <Link
                    href={`/request/apply?service=${id}`}
                    className="block w-full rounded-md bg-[#003527] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#064e3b]"
                >
                    Qabso Ballan
                </Link>
            </div>
        </article>
    );
}