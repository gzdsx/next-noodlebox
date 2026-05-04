import {apiGet} from "@/lib/api";
import PageClient from "./PageClient";

const fetchCategory = async (slug: string) => {
    try {
        const response = await apiGet(`/categories/${slug}`);
        return response.data;
    } catch (e) {
        console.log('获取分类失败:', e);
        return null;
    }
}

const fetchProducts = async (categoryId: number) => {
    try {
        const response = await apiGet(`/products`, {category_id: categoryId, limit: 100});
        return response.data.items;
    } catch (e) {
        console.log('获取产品失败:', e);
        return [];
    }
}

export default async function Page({params}: {params: {slug: string}}) {
    const {slug} = await params;
    const category = await fetchCategory(slug);
    const products = await fetchProducts(category?.id || 0);

    return (
        <PageClient category={category} products={products}/>
    )
}