import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Collection from '@/models/Collection'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    await dbConnect()

    const baseUrl = 'https://merosaaj.com'

    // Fetch all products
    const products = await Product.find({}).select('slug updatedAt').lean()
    const productUrls = products.map((product: any) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: product.updatedAt || new Date(),
    }))

    // Fetch all collections
    const collections = await Collection.find({ isActive: true }).select('slug updatedAt').lean()
    const collectionUrls = collections.map((collection: any) => ({
        url: `${baseUrl}/collections/${collection.slug}`,
        lastModified: collection.updatedAt || new Date(),
    }))

    // Static pages
    const staticPages = [
        '',
        '/shop',
        '/collections',
        '/about',
        '/contact',
        '/shipping',
        '/returns',
        '/faq',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
    }))

    return [...staticPages, ...productUrls, ...collectionUrls]
}
