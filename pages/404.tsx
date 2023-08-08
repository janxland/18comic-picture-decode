import "@/styles/globals.css";
import Head from "next/head";
import Link from "next/link";

export default function Error404() {
    return (
        <>
            <Head>
                <title>404 Not Found</title>
            </Head>
            <div className="flex h-screen flex-col items-center justify-center">
                <h1 className="mb-3 text-2xl">404 Not Found</h1>
                <Link href="/">
                    <button className="rounded-3xl border bg-black pl-4 pr-4 pt-2 pb-2 text-sm text-white focus:ring-2 focus:ring-gray-500">
                        Home
                    </button>
                </Link>
            </div>
        </>
    );
}
