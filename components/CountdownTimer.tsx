"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
    targetDate: Date;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex gap-2 text-center">
            {Object.entries(timeLeft).map(([label, value], i) => (
                <div key={label} className="flex gap-2 items-center">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        className="bg-accent text-white rounded-md p-2 min-w-[50px] flex flex-col items-center justify-center shadow-md"
                    >
                        <span className="text-xl font-black tabular-nums leading-none">
                            {value < 10 ? `0${value}` : value}
                        </span>
                        <span className="text-[8px] uppercase tracking-widest font-bold opacity-80">
                            {label.charAt(0)}
                        </span>
                    </motion.div>
                    {i < 3 && <span className="text-accent font-black text-xl">:</span>}
                </div>
            ))}
        </div>
    );
};

export default CountdownTimer;
