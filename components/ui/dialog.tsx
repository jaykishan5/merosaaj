import * as React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onOpenChange && onOpenChange(false);
            }
        };
        if (open) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-all duration-300">
            <div
                className="absolute inset-0 z-0"
                onClick={() => onOpenChange && onOpenChange(false)}
            />
            {children}
        </div>
    );
}

interface DialogContentProps {
    className?: string;
    children: React.ReactNode;
}

export function DialogContent({ className = '', children }: DialogContentProps) {
    return (
        <div
            className={`relative z-10 bg-card rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 ${className}`}
        >
            {children}
        </div>
    );
}

export function DialogHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`flex items-center justify-between px-8 py-6 border-b border-border/50 ${className}`}>{children}</div>;
}

export function DialogTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <h2 className={`text-xl font-black uppercase tracking-tighter italic ${className}`}>{children}</h2>;
}

export function DialogDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`px-8 py-6 ${className}`}>{children}</div>;
}

export function DialogClose({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
    return (
        <div onClick={onClick}>
            {children}
        </div>
    );
}
