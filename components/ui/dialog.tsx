"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const DialogContext = React.createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
} | null>(null);

export function Dialog({
    children,
    open: openProp,
    onOpenChange,
}: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [openState, setOpenState] = React.useState(false);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = React.useCallback(
        (value: boolean) => {
            if (openProp === undefined) {
                setOpenState(value);
            }
            onOpenChange?.(value);
        },
        [openProp, onOpenChange]
    );

    return (
        <DialogContext.Provider value={{ open, setOpen }}>
            {children}
        </DialogContext.Provider>
    );
}

export function DialogTrigger({
    children,
    asChild,
}: {
    children: React.ReactNode;
    asChild?: boolean;
}) {
    const context = React.useContext(DialogContext);
    if (!context) throw new Error("DialogTrigger must be used within Dialog");

    const handleClick = () => context.setOpen(true);

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
                children.props.onClick?.(e);
                handleClick();
            },
        });
    }

    return (
        <button onClick={handleClick}>
            {children}
        </button>
    );
}

export function DialogContent({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const context = React.useContext(DialogContext);
    if (!context) throw new Error("DialogContent must be used within Dialog");

    if (!context.open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => context.setOpen(false)}
            />
            <div
                className={cn(
                    "relative z-50 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300",
                    className
                )}
            >
                <button
                    onClick={() => context.setOpen(false)}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>
                {children}
            </div>
        </div>
    );
}

export function DialogHeader({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("px-8 py-6 border-b border-border/50", className)}>
            {children}
        </div>
    );
}

export function DialogTitle({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <h2 className={cn("text-xl font-black uppercase tracking-tighter italic", className)}>
            {children}
        </h2>
    );
}

export function DialogDescription({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("px-8 py-6", className)}>
            {children}
        </div>
    );
}

export function DialogClose({
    children,
}: {
    children: React.ReactNode;
}) {
    const context = React.useContext(DialogContext);
    if (!context) throw new Error("DialogClose must be used within Dialog");

    if (React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
                children.props.onClick?.(e);
                context.setOpen(false);
            },
        });
    }

    return (
        <div onClick={() => context.setOpen(false)}>
            {children}
        </div>
    );
}
