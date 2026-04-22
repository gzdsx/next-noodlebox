'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Breadcrumb, Pagination, Drawer, Button } from 'antd';
import { Filter } from 'lucide-react';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { useTranslations } from '@/contexts/LocaleContext';
import ProductGrid from '@/components/frontend/ProductGrid';
import CategorySidebar from '@/components/frontend/CategorySidebar';
import PriceFilter from '@/components/frontend/PriceFilter';
import ProductListFilters from '@/components/frontend/ProductListFilters';

interface Product {
    id: number;
    title: string;
    thumbnail: string;
    price: number;
    original_price?: number;
    badge?: string;
    sales?: number;
}

export default function ProductsClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const {t} = useTranslations('ecommerce');

    const q = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort') || 'default';
    const pageParam = parseInt(searchParams.get('page') || '1', 10);

    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
        categoryParam ? parseInt(categoryParam, 10) : undefined
    );
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const limit = 20;

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, any> = {
                status: 'publish',
                limit,
                offset: (pageParam - 1) * limit,
            };
            if (q) params.q = q;
            if (selectedCategory) params.category = selectedCategory;
            if (sortParam && sortParam !== 'default') {
                if (sortParam === 'price_asc') {
                    params.sort = 'price';
                    params.order = 'asc';
                } else if (sortParam === 'price_desc') {
                    params.sort = 'price';
                    params.order = 'desc';
                } else {
                    params.sort = sortParam;
                }
            }
            if (priceRange[0] > 0) params.min_price = priceRange[0];
            if (priceRange[1] < 10000) params.max_price = priceRange[1];

            const response = await apiGet('/products', params);
            const {items, total} = response.data;
            const totalItems = total;
            setProducts(items);
            setTotal(totalItems);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, [q, selectedCategory, sortParam, pageParam, priceRange]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const updateParams = (updates: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        router.push(`/products?${params.toString()}`);
    };

    const handleCategorySelect = (categoryId: number | undefined) => {
        setSelectedCategory(categoryId);
        updateParams({ category: categoryId ? String(categoryId) : undefined, page: '1' });
    };

    const handleSortChange = (sort: string) => {
        updateParams({ sort: sort === 'default' ? undefined : sort, page: '1' });
    };

    const handlePageChange = (page: number) => {
        updateParams({ page: String(page) });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filterContent = (
        <div className="space-y-6">
            <CategorySidebar selected={selectedCategory} onSelect={handleCategorySelect}/>
            <div className="border-t border-gray-100 pt-4">
                <PriceFilter onChange={setPriceRange}/>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { title: <Link href="/">{t('header.home')}</Link> },
                    { title: t('header.products') },
                ]}
                className="mb-6"
            />

            {/* Search results indicator */}
            {q && (
                <div className="mb-4 text-sm text-gray-500">
                    {t('filter.searchResult')}: <span className="font-medium text-gray-800">"{q}"</span>
                </div>
            )}

            <div className="flex gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-56 shrink-0">
                    <div className="sticky top-20 bg-white rounded-xl border border-gray-100 p-4">
                        {filterContent}
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-6">
                        <ProductListFilters sort={sortParam} onSortChange={handleSortChange}/>
                        <Button
                            className="lg:hidden"
                            icon={<Filter size={16}/>}
                            onClick={() => setMobileFilterOpen(true)}
                        >
                            {t('filter.filter')}
                        </Button>
                    </div>

                    {/* Product Grid */}
                    <ProductGrid products={products} loading={loading} columns={4}/>

                    {/* Pagination */}
                    {total > limit && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                current={pageParam}
                                total={total}
                                pageSize={limit}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <Drawer
                title={t('filter.filter')}
                placement="left"
                onClose={() => setMobileFilterOpen(false)}
                open={mobileFilterOpen}
                size="default"
            >
                {filterContent}
            </Drawer>
        </div>
    );
}
