"use client";

import { useTransition } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (locale: string) => {
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSelectChange("en")}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSelectChange("ne")}>
                    नेपाली (Nepali)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
