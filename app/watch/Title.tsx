export default function Title({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-6 text-3xl text-gray-500 dark:text-white dark:text-opacity-60">
            {children}
        </div>
    );
}
