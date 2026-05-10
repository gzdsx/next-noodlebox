'use client'

import Link from "next/link";
import React from "react";
import ProductCard from "@/components/frontend/ProductCard";
import {useCategories} from "@/contexts/AppContext";
import {Category, Product} from "@/types";

interface PageClientProps {
    category: Category;
    products: Product[];
}

const PageClient = ({category, products}: PageClientProps) => {
    const categories = useCategories();
    const pasrseCategories = React.useMemo(() => {
        return categories.filter((cat) => cat.id !== 221 && cat.id !== 15);
    }, [categories])

    return (
        <>
            <div className={'h-20'}></div>
            <div className={'flex flex-col md:flex-row gap-8'}>
                <div className={'grow'}>
                    <h1 className={'text-center text-2xl md:text-4xl font-bold my-4'}>{category?.name}</h1>
                    <div className={'w-full md:max-w-350 p-4 mx-auto'}>
                        <div className={'grid grid-cols-2 md:grid-cols-4 gap-4'}>
                            {
                                products.map((product) => (
                                    <ProductCard key={product.id} product={product}/>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className={'w-100'}>
                    <h1 className={'text-2xl font-bold my-4 uppercase'}>Categories</h1>
                    <ul className={'leading-[1.8]'}>
                        {
                            pasrseCategories.map((cat) => (
                                <li key={`category-${cat.id}`}>
                                    <Link href={`/category/${cat.slug}`}
                                          className={'text-[#66beb8] text-[18px] hover:text-white hover:underline'}>{cat.name}</Link>
                                </li>
                            ))
                        }
                    </ul>
                    <Link href={'/points-mall'}>
                        <span
                            className={'bg-[#66beb8] text-white inline-block text-[18px] py-2 px-4 mt-4 rounded-[5px] hover:bg-[#41918b]'}>Points Mall</span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default PageClient;