"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Ruler, Calculator, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SizeGuideModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline flex items-center gap-1">
                    <Ruler className="w-3 h-3" /> Size Guide
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-md md:max-w-lg bg-white rounded-2xl p-0 overflow-hidden">
                <div className="p-6 bg-primary text-white text-center">
                    <h2 className="text-xl font-black uppercase tracking-widest">Find Your Perfect Fit</h2>
                    <p className="text-xs text-primary-foreground/70 font-bold mt-1">Accurate measurements for the best look.</p>
                </div>

                <Tabs defaultValue="chart" className="p-6">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="chart" className="font-bold text-xs uppercase tracking-widest">Size Chart</TabsTrigger>
                        <TabsTrigger value="predictor" className="font-bold text-xs uppercase tracking-widest">Fit Predictor</TabsTrigger>
                    </TabsList>

                    <TabsContent value="chart" className="space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs font-bold text-left">
                                <thead className="bg-muted/50 uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th className="p-3">Size</th>
                                        <th className="p-3">Chest (in)</th>
                                        <th className="p-3">Length (in)</th>
                                        <th className="p-3">Shoulder (in)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="p-3 font-black text-primary">S</td>
                                        <td className="p-3">38-40</td>
                                        <td className="p-3">27</td>
                                        <td className="p-3">17</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-black text-primary">M</td>
                                        <td className="p-3">40-42</td>
                                        <td className="p-3">28</td>
                                        <td className="p-3">18</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-black text-primary">L</td>
                                        <td className="p-3">42-44</td>
                                        <td className="p-3">29</td>
                                        <td className="p-3">19</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-black text-primary">XL</td>
                                        <td className="p-3">44-46</td>
                                        <td className="p-3">30</td>
                                        <td className="p-3">20</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic text-center">* Measurements may vary slightly by style.</p>
                    </TabsContent>

                    <TabsContent value="predictor">
                        <FitPredictor />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

function FitPredictor() {
    const [height, setHeight] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [recommendation, setRecommendation] = useState<string | null>(null);

    const calculateSize = () => {
        if (!height || !weight) return;

        const h = Number(height); // cm
        const w = Number(weight); // kg

        // Simple logic
        let size = "M";
        if (h < 165 && w < 60) size = "S";
        else if (h > 180 || w > 85) size = "XL";
        else if (h > 175 || w > 75) size = "L";

        setRecommendation(size);
    };

    return (
        <div className="space-y-6">
            {!recommendation ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wide text-muted-foreground">Height (cm)</label>
                        <input
                            type="number"
                            className="w-full bg-muted/30 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-accent"
                            placeholder="e.g. 175"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wide text-muted-foreground">Weight (kg)</label>
                        <input
                            type="number"
                            className="w-full bg-muted/30 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-accent"
                            placeholder="e.g. 70"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                        />
                    </div>
                    <button
                        onClick={calculateSize}
                        disabled={!height || !weight}
                        className="w-full bg-primary text-white h-12 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Calculator className="w-4 h-4" /> Calculate Size
                    </button>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4 py-4"
                >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Recommended Size</p>
                        <p className="text-6xl font-black text-primary mt-2">{recommendation}</p>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium max-w-[200px] mx-auto">
                        Based on your measurements, {recommendation} should provide a comfortable regular fit.
                    </p>
                    <button
                        onClick={() => setRecommendation(null)}
                        className="text-xs font-black text-accent hover:underline uppercase tracking-wide"
                    >
                        Recalculate
                    </button>
                </motion.div>
            )}
        </div>
    );
}
