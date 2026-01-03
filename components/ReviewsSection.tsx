"use client";

import { useState, useEffect } from "react";
import { Star, User, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "framer-motion";

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

interface Review {
    _id: string;
    user: {
        name: string;
        email: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ReviewsSection({ productId }: { productId: string }) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews?productId=${productId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error("Failed to fetch reviews");
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [productId]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            toast.error("Please sign in to write a review");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, rating, comment }),
            });

            if (res.ok) {
                const newReview = await res.json();
                setReviews([newReview, ...reviews]);
                setComment("");
                setRating(5);
                toast.success("Review submitted successfully!");
            } else {
                toast.error("Failed to submit review");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-8 md:p-12 mt-8">
            <h2 className="text-2xl font-black text-primary mb-8 uppercase tracking-widest flex items-center gap-4">
                <div className="w-8 h-1 bg-accent"></div>
                Community Reviews
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Statistics */}
                <div className="space-y-6">
                    <div className="bg-muted/30 p-8 rounded-2xl text-center border border-gray-50">
                        <div className="text-6xl font-black text-primary mb-2">{averageRating}</div>
                        <div className="flex justify-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={`w-5 h-5 ${s <= Math.round(Number(averageRating)) ? "fill-accent text-accent" : "text-gray-200"}`}
                                />
                            ))}
                        </div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                            Based on {reviews.length} Reviews
                        </p>
                    </div>

                    {session ? (
                        <form onSubmit={handleSubmit} className="bg-muted/10 p-6 rounded-2xl border border-dashed border-gray-200">
                            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Write a Review</h4>
                            <div className="flex gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-6 h-6 ${s <= rating ? "fill-accent text-accent" : "text-gray-200"}`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                required
                                className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm min-h-[100px] mb-4 outline-none focus:ring-2 focus:ring-accent/20"
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-primary text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                                {submitting ? "Posting..." : "Post Review"}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-muted/10 p-6 rounded-2xl border border-dashed border-gray-200 text-center">
                            <p className="text-sm text-muted-foreground mb-4">Sign in to share your experience with the community.</p>
                            <a href="/login" className="text-xs font-black text-accent uppercase tracking-widest border-b border-accent pb-1">Login to Review</a>
                        </div>
                    )}
                </div>

                {/* Review List */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="flex flex-col gap-4 animate-pulse">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 bg-muted/20 rounded-2xl" />
                            ))}
                        </div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={review._id}
                                className="group p-6 rounded-2xl border border-gray-50 hover:border-gray-100 hover:shadow-lg transition-all bg-white"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                            {review.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-primary">{review.user.name}</h4>
                                            <div className="flex gap-0.5 mt-1">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className={`w-3 h-3 ${s <= review.rating ? "fill-accent text-accent" : "text-gray-200"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                        {timeAgo(review.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed pl-[3.25rem]">
                                    {review.comment}
                                </p>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12 text-muted-foreground">
                            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                            <p className="font-medium">No reviews yet.</p>
                            <p className="text-sm">Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
