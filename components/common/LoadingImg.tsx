"use client"
import { ImgHTMLAttributes, useEffect, useRef, useState } from "react";
import SkeletonBlock from "../SkeletonBlock";

interface LoadingImgProps extends ImgHTMLAttributes<HTMLImageElement> {
    loadView?: React.ReactNode;
    fallback?: React.ReactNode;
}
export default function LoadingImg(props: LoadingImgProps) {
    const imgRef = useRef<HTMLImageElement>(null)
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)
    useEffect(() => {
        if (imgRef.current) {
            if (imgRef.current.complete) {
                setLoaded(true)
                return
            }
            imgRef.current.onload = () => {
                setLoaded(true)
            }
            imgRef.current.addEventListener("error", () => {
                setError(true)
            })
        }
        return (() => {
            if (imgRef.current) {
                imgRef.current!.removeEventListener("error", () => {
                    console.log("error");
                })
            }
        })
    }, [props.src])
    if (error) {
        return (
            <>
                {props.fallback ?? <div className="w-full h-full bg-gray-200"></div>}
            </>
        )
    }
    return (
        <>
            {!loaded && (props.loadView ?? <SkeletonBlock className="h-full w-full" />)}
            <img hidden={!loaded} ref={imgRef} {...props} />
        </>
    )
}