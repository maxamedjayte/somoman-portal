import Link from "next/link";

type WhatsAppButtonProps = {
    whatsappNumber?: string;
};

export default function WhatsAppButton({ whatsappNumber }: WhatsAppButtonProps) {
    if (!whatsappNumber) return null;

    const cleanNumber = whatsappNumber.replace(/\D/g, '');

    return (
        <Link
            href={`https://wa.me/${cleanNumber}`}
            target="_blank"
            className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#25D366] text-white shadow-[0_18px_45px_rgba(37,211,102,0.35)] transition hover:scale-105"
            aria-label="Chat on WhatsApp"
        >
            <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                fill="currentColor"
            >
                <path d="M20.52 3.48A11.8 11.8 0 0 0 12.06 0C5.54 0 .24 5.3.24 11.82c0 2.08.54 4.1 1.58 5.89L0 24l6.47-1.7a11.78 11.78 0 0 0 5.59 1.42h.01c6.52 0 11.82-5.3 11.82-11.82 0-3.16-1.23-6.13-3.37-8.42Zm-8.46 18.2h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.84 1.01 1.02-3.75-.24-.39a9.78 9.78 0 0 1-1.5-5.17c0-5.42 4.41-9.83 9.83-9.83 2.62 0 5.08 1.02 6.94 2.89a9.75 9.75 0 0 1 2.88 6.94c0 5.42-4.41 9.83-9.83 9.83Zm5.39-7.34c-.29-.14-1.73-.85-2-.95-.27-.1-.47-.14-.67.14-.19.29-.77.95-.94 1.14-.17.19-.34.22-.63.07-.29-.14-1.21-.45-2.31-1.44-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.44.13-.58.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.19 0-.5.07-.77.36-.27.29-1.03 1.01-1.03 2.45s1.06 2.84 1.21 3.03c.14.19 2.08 3.18 5.04 4.46.71.31 1.27.49 1.71.63.72.23 1.38.2 1.89.12.58-.09 1.73-.71 1.98-1.39.24-.69.24-1.27.17-1.39-.07-.12-.27-.19-.56-.33Z" />
            </svg>
        </Link>
    );
}