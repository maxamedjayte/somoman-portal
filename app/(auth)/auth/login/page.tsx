"use client";

import { login } from "./actions";
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {pending ? "Signing in..." : "Sign In"}
        </button>
    );
}

export default function LoginPage() {
    const [state, formAction] = useFormState(login, { error: "" });

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 sm:p-8">
            <div className="flex min-h-[700px] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-2xl shadow-emerald-900/10 lg:flex-row">
                <div className="flex w-full flex-col justify-center p-8 sm:p-16 lg:w-1/2">
                    <div className="mx-auto w-full max-w-sm">
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900">
                                Welcome Back
                            </h1>
                            <p className="text-sm text-gray-500">
                                Please enter your details to sign in.
                            </p>
                        </div>

                        {state?.error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {state.error}
                            </div>
                        )}

                        <form action={formAction} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="ml-1 text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="name@company.com"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="ml-1 text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    />
                                </div>
                            </div>

                            <SubmitButton />
                        </form>

                        <div className="mt-8 text-center">
                            <button
                                type="button"
                                className="text-sm font-medium text-gray-500 transition-colors hover:text-emerald-600"
                            >
                                Don&apos;t have an account?{" "}
                                <span className="font-bold text-emerald-600 underline underline-offset-4">
                                    Sign Up
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative hidden w-1/2 flex-col justify-between bg-emerald-600 p-12 lg:flex">
                    <div className="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

                    <div className="relative z-10">
                        <div className="mb-16 flex items-center gap-2">
                            <span className="text-xl font-black uppercase tracking-tighter text-white">
                                Oman Agency
                            </span>
                        </div>

                        <h2 className="mb-6 text-4xl font-bold leading-tight text-white">
                            Efficiency starts with a single click.
                        </h2>

                        <p className="max-w-md text-emerald-100">
                            Manage requests, track activity, and keep your workflow organized
                            in one professional portal.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-transform hover:scale-[1.02]">
                            <div className="flex items-center gap-4 text-white">
                                <div className="rounded-lg bg-emerald-500 p-2" />
                                <div>
                                    <p className="text-xs font-bold uppercase opacity-70">
                                        Success Rate
                                    </p>
                                    <p className="text-xl font-bold">99.2%</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-transform hover:scale-[1.02]">
                            <div className="flex items-center gap-4 text-white">
                                <div className="rounded-lg bg-emerald-500 p-2" />
                                <div>
                                    <p className="text-xs font-bold uppercase opacity-70">
                                        Active Users
                                    </p>
                                    <p className="text-xl font-bold">12,400+</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="relative z-10 text-sm text-emerald-100 opacity-80">
                        © 2026 Oman Agency. All rights reserved. Professionalism in every
                        step.
                    </p>
                </div>
            </div>
        </div>
    );
}