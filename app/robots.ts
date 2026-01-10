import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/checkout/'],
        },
        sitemap: 'https://merosaaj.com/sitemap.xml',
    }
}
