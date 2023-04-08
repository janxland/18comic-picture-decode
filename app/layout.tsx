import '@/styles/globals.css';
import RootProvider from './client/RootProvider';

export const metadata = {
    title: {
        template: '%s | Miru',
        default: "Miru"
    }
}


export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html>
            <body className="dark:bg-black dark:text-white dark:bg-opacity-80">
                <RootProvider>
                    <div className="ml-0 lg:ml-230px transition-all" style={{ maxWidth: "1400px" }}>
                        {children}
                        <div className='h-28 lg:hidden'></div>
                    </div>
                </RootProvider>
            </body>
        </html>
    )
}
