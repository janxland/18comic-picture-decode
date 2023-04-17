import "@/styles/globals.css";
import RootProvider from "@/app/RootProvider";
import {ReactNode} from "react";

export const metadata = {
    title: {
        default: 'Miru',
        template: '%s - Miru',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        minimumScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
};

export default async function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html>
            <body className="dark:bg-black dark:bg-opacity-80 dark:text-white">
                <RootProvider>
                    <div className="ml-0 lg:ml-230px">
                        <div className="m-auto" style={{ maxWidth: "1400px" }}>
                            {children}
                        </div>
                        <div className="h-28 lg:hidden"></div>
                    </div>
                </RootProvider>
            </body>
        </html>
    );
}
