import "@/styles/globals.css";
import Head from "next/head";
import Link from "next/link";

export default function Error404() {
    return (
        <>
            <Head>
                <title>404 Not Found</title>
            </Head>
            <div className="h-screen flex justify-center items-center flex-col">
                <h1 className="text-2xl mb-3">404 Not Found</h1>
                <Link href="/">
                    <button className="focus:ring-2 focus:ring-gray-500 border pl-4 pr-4 pt-2 pb-2 text-sm bg-black text-white rounded-3xl">
                        Home
                    </button>
                </Link>
            </div>
        </>
    );
}
