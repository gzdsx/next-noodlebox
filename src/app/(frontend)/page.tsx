import { apiGet } from '@/lib/api';
import HeroBanner from '@/components/frontend/HeroBanner';
import ProductGrid from '@/components/frontend/ProductGrid';
import HomeClient from '@/components/frontend/HomeClient';

interface Product {
    id: number;
    title: string;
    thumbnail: string;
    price: number;
    original_price?: number;
    badge?: string;
    sales?: number;
}

async function fetchProducts(params: Record<string, any>): Promise<Product[]> {
    try {
        const response = await apiGet('/products', params);
        console
        return response.data.items || [];
    } catch {
        return [];
    }
}

async function fetchCategories() {
    try {
        const response = await apiGet('/categories', { taxonomy: 'product_category' });
        console.log(response.data.items);
        return response.data.items || [];
    } catch(e) {
        console.log(e);
        return [];
    }
}

export default async function HomePage() {
    const [hotProducts, newProducts] = await Promise.all([
        fetchProducts({limit: 10, order_by: 'sales', order_direction: 'desc'}),
        fetchProducts({limit: 10, order_by: 'sales', order_direction: 'id'}),
    ]);

    return (
        <div>
            <HeroBanner/>
            {/* Hot Products */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <HomeClient section="hotProducts"/>
                </div>
                <ProductGrid products={hotProducts}/>
            </section>

            {/* Promotional Banner */}
            <section className="bg-linear-to-r from-orange-500 to-pink-500 text-white">
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <HomeClient section="promotions"/>
                </div>
            </section>

            {/* New Arrivals */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <HomeClient section="newArrivals"/>
                </div>
                <ProductGrid products={newProducts}/>
            </section>
        </div>
    );
}
