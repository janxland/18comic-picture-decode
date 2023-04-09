import {FC, useEffect, useRef, useState} from "react";

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
}

const LazyImage: FC<LazyImageProps> = ({src, alt, placeholder, className}) => {
    const placeholderBase64: string = 'string' === typeof placeholder ? placeholder : "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    const imgRef = useRef<HTMLImageElement>(null);
    const [imageSrc, setImageSrc] = useState(placeholderBase64);
    useEffect(() => {
        const img = imgRef.current;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setImageSrc(src);
                    observer.unobserve(entry.target);
                }
            });
        });
        if (null !== img) {
            observer.observe(img);
        }
        return () => {
            observer.disconnect();
        }
    }, []);
    return (
        <img ref={imgRef} src={imageSrc} alt={alt} className={className}/>
    )
}

export default LazyImage;
