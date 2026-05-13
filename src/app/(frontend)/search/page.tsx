import {apiGet} from "@/lib/api";
import ProductCard from "@/components/frontend/ProductCard";

const searchProducts = async (q: string) => {
    try {
        const response = await apiGet('/products', {q, limit: 50});
        return response.data.items;
    } catch {
        return [];
    }
}

export default async function Page({searchParams}: { searchParams: { q: string } }) {
    const {q} = await searchParams;
    const products: any[] = await searchProducts(q);

    if (products.length === 0) {
        return (
            <div className={'mt-24 flex items-center justify-center min-h-100'}>
                <h1 className={'font-bold text-2xl'}>No Products Found</h1>
            </div>
        )
    }

    return (
        <div className={'max-w-350 mx-auto mt-24 grid grid-cols-2 md:grid-cols-5 gap-4'}>
            {
                products.map((product: any) => (
                    <ProductCard key={`product-${product.id}`} product={product}/>
                ))
            }
        </div>
    );
}