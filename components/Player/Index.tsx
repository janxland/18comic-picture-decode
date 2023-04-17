import { motion } from "framer-motion";
import { useState } from "react";

export default function Player() {
    const [isMini, setIsMini] = useState(true);
    return (
        <>
            {!isMini && (
                <motion.div
                    className="fixed right-0 bottom-0 left-0 top-0 z-50 bg-blue-400"
                    layoutId="player"
                    onDoubleClick={() => setIsMini(true)}
                >
                    <motion.h1 className="text-lg">Player</motion.h1>
                </motion.div>
            )}
            {isMini && (
                <motion.div
                    layoutId="player"
                    drag
                    className="fixed right-0 bottom-0 z-50 h-32 w-32 bg-blue-400"
                    onDoubleClick={() => setIsMini(false)}
                >
                    <motion.h1 className="text-lg">Miri Player</motion.h1>
                </motion.div>
            )}
        </>
    );
}
