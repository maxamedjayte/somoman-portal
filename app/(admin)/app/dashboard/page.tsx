import Link from "next/link";
import {
    Users,
    CheckCircle,
    Clock,
    FileText,
    Activity,
    TrendingUp,
} from "lucide-react";

const latestRequests = [
    {
        id: "REQ-1024",
        applicant: "Ahmed Hassan",
        service: "Visa Support",
        status: "pending",
        createdAt: "2026-03-28",
    },
    {
        id: "REQ-1023",
        applicant: "Amina Yusuf",
        service: "Housing",
        status: "approved",
        createdAt: "2026-03-27",
    },
    {
        id: "REQ-1022",
        applicant: "Mohamed Ali",
        service: "Business Setup",
        status: "pending",
        createdAt: "2026-03-26",
    },
    {
        id: "REQ-1021",
        applicant: "Fartun Noor",
        service: "Education Support",
        status: "rejected",
        createdAt: "2026-03-25",
    },
];

function getStatusClasses(status: string) {
    if (status === "approved") return "bg-emerald-100 text-emerald-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
}

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[28px] bg-white p-5 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#191c1d]/45">
                                Total Applications
                            </p>
                            <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#191c1d]">
                                248
                            </p>
                            <p className="mt-2 text-sm text-[#191c1d]/55">+12% this month</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4059aa] text-white">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] bg-white p-5 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#191c1d]/45">
                                Approved
                            </p>
                            <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#191c1d]">
                                174
                            </p>
                            <p className="mt-2 text-sm text-[#191c1d]/55">70% approval rate</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] bg-white p-5 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#191c1d]/45">
                                Pending Review
                            </p>
                            <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#191c1d]">
                                52
                            </p>
                            <p className="mt-2 text-sm text-[#191c1d]/55">Needs action</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] bg-white p-5 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#191c1d]/45">
                                Services Active
                            </p>
                            <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#191c1d]">
                                8
                            </p>
                            <p className="mt-2 text-sm text-[#191c1d]/55">Across all categories</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#003527] text-white">
                            <FileText className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle section */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_0.8fr]">
                <section className="rounded-[30px] bg-white p-6 shadow-[0_22px_50px_rgba(25,28,29,0.05)]">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#191c1d]/45">
                                Performance
                            </p>
                            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#191c1d]">
                                Service Distribution
                            </h2>
                        </div>

                        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                            <Activity className="h-4 w-4" />
                            System Live
                        </div>
                    </div>

                    <div className="grid h-[280px] grid-cols-4 items-end gap-4">
                        {[55, 78, 42, 90].map((value, index) => (
                            <div key={index} className="flex flex-col items-center gap-3">
                                <div className="flex h-full w-full items-end">
                                    <div
                                        className="w-full rounded-t-2xl bg-[linear-gradient(180deg,#4059aa,#003527)]"
                                        style={{ height: `${value}%` }}
                                    />
                                </div>
                                <span className="text-xs font-medium text-[#191c1d]/55">
                                    {["Visa", "Housing", "Business", "Education"][index]}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="rounded-[30px] bg-white p-6 shadow-[0_22px_50px_rgba(25,28,29,0.05)]">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#191c1d]/45">
                            Efficiency
                        </p>

                        <div className="mt-6 space-y-5">
                            <MetricRow label="Approval Rate" value="70%" width="70%" color="bg-emerald-500" />
                            <MetricRow label="Pending Load" value="52" width="52%" color="bg-amber-500" />
                            <MetricRow label="Processing Speed" value="2.4 Days" width="80%" color="bg-[#4059aa]" />
                        </div>
                    </div>

                    <Link
                        href="/app/requests"
                        className="flex items-center justify-center gap-2 rounded-[24px] bg-[#003527] px-5 py-4 text-sm font-bold text-white shadow-[0_20px_40px_rgba(0,53,39,0.22)] transition hover:-translate-y-0.5"
                    >
                        Manage All Requests
                        <TrendingUp className="h-4 w-4" />
                    </Link>
                </section>
            </div>

            {/* Latest requests */}
            <section className="overflow-hidden rounded-[30px] bg-white shadow-[0_22px_50px_rgba(25,28,29,0.05)]">
                <div className="flex items-center justify-between px-6 py-5">
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight text-[#191c1d]">
                            Latest Requests
                        </h2>
                        <p className="mt-1 text-sm text-[#191c1d]/55">
                            Most recent service applications
                        </p>
                    </div>

                    <Link
                        href="/app/requests"
                        className="rounded-full bg-[#f3f4f5] px-4 py-2 text-sm font-semibold text-[#191c1d]"
                    >
                        View all
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px]">
                        <thead>
                            <tr className="border-t border-[#eef1f2] text-left">
                                {["Request ID", "Applicant", "Service", "Status", "Created", "Action"].map((head) => (
                                    <th
                                        key={head}
                                        className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45"
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {latestRequests.map((request) => (
                                <tr
                                    key={request.id}
                                    className="border-t border-[#f1f3f5] transition hover:bg-[#fafbfb]"
                                >
                                    <td className="px-6 py-4 text-sm font-semibold text-[#003527]">
                                        {request.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#191c1d]">
                                        {request.applicant}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#191c1d]/75">
                                        {request.service}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusClasses(
                                                request.status
                                            )}`}
                                        >
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#191c1d]/60">
                                        {request.createdAt}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/app/requests/${request.id}`}
                                            className="text-sm font-semibold text-[#4059aa]"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

function MetricRow({
    label,
    value,
    width,
    color,
}: {
    label: string;
    value: string;
    width: string;
    color: string;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-end justify-between">
                <span className="text-sm font-medium text-[#191c1d]/65">{label}</span>
                <span className="text-lg font-extrabold text-[#191c1d]">{value}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#eef1f2]">
                <div className={`h-full rounded-full ${color}`} style={{ width }} />
            </div>
        </div>
    );
}