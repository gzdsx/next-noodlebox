'use client'

import {Category} from "@/types";
import React, {useRef, useState} from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi
} from "@/components/ui/carousel"
import ProductCard from "@/components/frontend/ProductCard";
import AutoHeight from "embla-carousel-auto-height"

interface ProductClientPCProps {
    categories: Category[];
}

export const ProductClientPC = ({categories}: ProductClientPCProps) => {
    const [currentCategory, setCurrentCategory] = useState(categories[0]);
    const carouselRef = useRef<CarouselApi | null>(null);

    return (
        <div className={'w-full hidden md:block'}>
            <div className={'flex justify-center gap-x-1'}>
                {
                    categories.map((cat, index) => (
                        <div key={`category-${cat.id}`} className={'cursor-pointer'} onClick={() => {
                            setCurrentCategory(cat);
                            carouselRef.current?.scrollTo(index);
                        }}>
                            <span
                                className={`block border-[#69d294] rounded-[5px] px-3 py-3 text-[14px] text-normal ${currentCategory.id === cat.id ? 'bg-white text-gray-500' : 'bg-[#75d69c] text-white'}`}>{cat.name}</span>
                        </div>
                    ))
                }
            </div>
            <div className={'mt-4 mx-4'}>
                <Carousel
                    setApi={(api: CarouselApi) => {
                        if (api) {
                            api.on('select', () => {
                                setCurrentCategory(categories[api.selectedScrollSnap()]);
                            });
                            carouselRef.current = api;
                        }
                    }}
                    plugins={[AutoHeight()]}
                    opts={{loop: true, align: 'center'}}
                >
                    <CarouselContent className="items-start transition-[height] duration-300">
                        {
                            categories.map((cat) => (
                                <CarouselItem key={`category-${cat.id}`}>
                                    <div
                                        className={'w-full h-full grid grid-cols-6 auto-rows-max gap-4 items-start justify-center'}>
                                        {
                                            cat.products?.map((product) => (
                                                <ProductCard key={`product-${product.id}`} product={product}/>
                                            ))
                                        }
                                    </div>
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    );
};