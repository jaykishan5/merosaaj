"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const slides = [
    {
        id: 1,
        title: "AUTHENTIC NEPAL",
        subtitle: "Heritage Collection",
        description: "Streetwear that captures the soul of Kathmandu and the majesty of the Himalayas.",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2670&auto=format&fit=crop", // Kathmandu cultural backdrop
        color: "accent"
    },
    {
        id: 2,
        title: "HIMALAYAN GRIT",
        subtitle: "Technical Drop",
        description: "Engineered for resilience. Built for the streets of the valley.",
        image: "https://images.unsplash.com/photo-1505305976870-c0be14404ebb?q=80&w=2670&auto=format&fit=crop", // Kathmandu urban vibes
        color: "primary"
    },
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <section className="relative h-[80vh] md:h-[90vh] bg-primary overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/40 flex items-center justify-center">
                        <div className="max-w-7xl mx-auto px-4 w-full text-center">
                            <motion.span
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block bg-accent px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6"
                            >
                                {slides[currentSlide].subtitle}
                            </motion.span>

                            <motion.h1
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl sm:text-6xl md:text-9xl font-black tracking-tighter text-white mb-6 md:mb-8 leading-none italic"
                            >
                                {slides[currentSlide].title.split(" ").map((word, i) => (
                                    <span key={i} className={i === 1 ? "text-accent block md:inline" : ""}>
                                        {word}{" "}
                                    </span>
                                ))}
                            </motion.h1>

                            <motion.p
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-sm sm:text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-12 font-medium px-4"
                            >
                                {slides[currentSlide].description}
                            </motion.p>

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 pb-12 sm:pb-0"
                            >
                                <Link
                                    href="/shop"
                                    className="w-full sm:w-auto px-10 py-4 sm:py-5 bg-white text-primary rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all shadow-xl hover:shadow-accent/40 group"
                                >
                                    Explore Drop
                                    <ArrowRight className="inline-block ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button className="w-full sm:w-auto px-10 py-4 sm:py-5 border-2 border-white/20 text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                                    Read Manifesto
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute inset-x-0 bottom-10 flex items-center justify-center gap-6 sm:gap-12 z-30">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        prevSlide();
                    }}
                    className="p-3 text-white/40 hover:text-white transition-colors border border-white/10 rounded-full bg-black/20 backdrop-blur-sm"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Dots */}
                <div className="flex gap-4 items-center">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentSlide(i);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? "w-10 bg-accent shadow-[0_0_15px_rgba(139,0,0,0.5)]" : "w-1.5 bg-white/30"}`}
                        />
                    ))}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        nextSlide();
                    }}
                    className="p-3 text-white/40 hover:text-white transition-colors border border-white/10 rounded-full bg-black/20 backdrop-blur-sm"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Decoration */}
            <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden 2xl:block pointer-events-none z-10">
                <span className="text-[8vw] font-black text-white/5 uppercase select-none leading-none [writing-mode:vertical-lr] rotate-180">MEROSAAJ</span>
            </div>
        </section>
    );
}
