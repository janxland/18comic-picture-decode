import { useEffect, useRef, useState } from "react";

interface LazyElement {
    children: React.ReactNode;
    placeholder: React.ReactNode;
    className?: string;
}

export default function LazyElement(props: LazyElement) {
    const [child, setChild] = useState<React.ReactNode>(props.placeholder);
    const elementRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const element = elementRef.current;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setChild(props.children)
                    observer.unobserve(entry.target);
                }
            });
        });
        if (null !== element) {
            observer.observe(element);
        }
        return () => {
            observer.disconnect();
        }
    })
    return (
        <div ref={elementRef} className={props.className}>
            {child}
        </div>
    )
}