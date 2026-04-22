import React, {Suspense} from 'react';
import {Breadcrumb, Button, Drawer, Pagination, Spin} from 'antd';
import {apiGet} from "@/lib/api";
import Link from "next/link";
import ProductListFilters from "@/components/frontend/ProductListFilters";
import {Filter} from "lucide-react";
import ProductGrid from "@/components/frontend/ProductGrid";
import CustomPagination from "@/components/frontend/CustomPagination";

interface Product {
    id: number;
    title: string;
    thumbnail: string;
    price: number;
    original_price?: number;
    icon?: string;
    sales?: number;
}

const getProducts = async (params: Record<string, any>): Promise<{ items: Product[]; total: number }> => {
    try {
        const response = await apiGet('/products', params);
        return response.data;
    } catch {
        return {items: [], total: 0};
    }
}

export default async function ProductsPage({searchParams}: any) {
    const {q = '', page = 1} = await searchParams;
    const {items: products, total} = await getProducts({q, limit: 20, offset: (page - 1) * 20});
    return (
        <Suspense fallback={<div className="flex justify-center py-24"><Spin size="large"/></div>}>
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        {title: <Link href="/">首页</Link>},
                        {title: '全部商品'},
                    ]}
                    className="mb-6"
                />

                {/* Search results indicator */}
                {q && (
                    <div className="mb-4 text-sm text-gray-500">
                        搜索: <span className="font-medium text-gray-800">{q}</span>
                    </div>
                )}

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-56 shrink-0">
                        <div className="sticky top-20 bg-white rounded-xl border border-gray-100 p-4">

                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">


                        {/* Product Grid */}
                        <ProductGrid products={products} columns={4}/>

                        {/* Pagination */}
                        {total > 20 && (
                            <CustomPagination
                                total={total}
                                current={page}
                                pageSize={20}
                            />
                        )}
                    </div>
                </div>

            </div>
        </Suspense>
    );
}
