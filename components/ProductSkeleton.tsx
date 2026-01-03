export default function ProductSkeleton() {
    return (
        <div className="w-[280px] md:w-[320px] shrink-0 snap-start animate-pulse">
            <div className="aspect-[4/5] bg-muted/40 rounded-[2rem] mb-6 shadow-sm border border-black/5" />
            <div className="px-2 space-y-4">
                <div className="h-4 bg-muted/40 rounded w-2/3" />
                <div className="flex gap-4">
                    <div className="h-6 bg-muted/40 rounded w-20" />
                    <div className="h-4 bg-muted/40 rounded w-16" />
                </div>
            </div>
        </div>
    );
}
