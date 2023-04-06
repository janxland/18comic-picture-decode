"use client"
import { motion } from "framer-motion";
import { HTMLProps } from "react";

export default function Layout(props: HTMLProps<HTMLDivElement>) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
        >
            {props.children}
        </motion.div>
    )
}