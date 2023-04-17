export default function Title({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-3xl mb-6 text-gray-500 dark:text-white dark:text-opacity-60">
            {children}
        </div>
    );
}
