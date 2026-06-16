import React, {Suspense} from 'react';
import {Spinner} from '@/components/ui/spinner';
import {apiGet} from "@/lib/api";
import {Category} from "@/types";
import HeroCarousel, {Slide} from "@/app/(frontend)/shop/HeroCarousel";
import CategoryClient from "@/app/(frontend)/shop/CategoryClient";
import {ProductClientPC} from "@/app/(frontend)/shop/ProductClientPC";
import ProductClientMobile from "@/app/(frontend)/shop/ProductClientMobile";
import {Metadata} from "next";

const getProducts = async (): Promise<Category[]> => {
    try {
        const response = await apiGet('/products/grouped');
        return response.data;
    } catch {
        return [];
    }
}

const getSlides = async () => {
    try {
        const response = await apiGet('/swipers/79/slides');
        return response.data.items;
    } catch (e) {
        console.log('获取轮播图失败:', e);
        return [];
    }
}

export const metadata: Metadata = {
    title: 'Drogheda Shop - The Best Chinese Takeaway In Drogheda',
}

export default async function ProductsPage() {
    const categories = await getProducts();
    const slides: Slide[] = await getSlides();
    return (
        <Suspense fallback={<div className="flex justify-center py-24"><Spinner size="lg"/></div>}>
            <div className={'bg-[url(/shop-bg.png)]'}>
                <HeroCarousel slides={slides}/>
                <CategoryClient/>
                <ProductClientPC categories={categories}/>
                <ProductClientMobile categories={categories}/>
            </div>
        </Suspense>
    );
}
