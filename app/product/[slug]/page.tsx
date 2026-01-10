import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductDetailsClient from './ProductDetailsClient';
import Navbar from "@/components/Navbar";

interface Props {
    params: { slug: string };
}

async function getProduct(slug: string) {
    await dbConnect();
    const product = await Product.findOne({ slug }).lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const product = await getProduct(params.slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    const title = `${product.name} | merosaaj`;
    const description = product.description.slice(0, 160);
    const images = product.images.length > 0 ? [product.images[0]] : ['/og-image.jpg'];

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images,
        },
    };
}

export default async function ProductDetailsPage({ params }: Props) {
    const product = await getProduct(params.slug);

    if (!product) {
        notFound();
    }

    return (
        <>
            <Navbar />
            <ProductDetailsClient product={product} />
        </>
    );
}
