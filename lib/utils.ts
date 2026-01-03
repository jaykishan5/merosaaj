import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
    }).format(price)
}

export function formatDate(date: Date | string) {
    return new Intl.DateTimeFormat('en-NP', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date))
}
