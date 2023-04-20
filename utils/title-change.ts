export default function changeTitle(title: string) {
    if (typeof window !== "undefined") {
        document.title = `${title} | Miru`;
    }
}