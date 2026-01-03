"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(path => path);

    if (paths.length === 0) return null;

    return (
        <nav className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-primary transition-colors flex items-center">
                <Home className="w-4 h-4" />
            </Link>
            {paths.map((path, index) => {
                const href = `/${paths.slice(0, index + 1).join('/')}`;
                const isLast = index === paths.length - 1;
                const formattedName = path.replace(/-/g, ' ');

                return (
                    <div key={path} className="flex items-center space-x-2">
                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground/50" />
                        {isLast ? (
                            <span className="font-bold text-primary capitalize">{formattedName}</span>
                        ) : (
                            <Link href={href} className="hover:text-primary transition-colors capitalize">
                                {formattedName}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
