import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'merosaaj | Premium Nepali Streetwear',
        short_name: 'merosaaj',
        description: 'Modern Nepali clothing and accessories brand combining streetwear aesthetics with cultural identity.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#8B0000',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
