'use client'

import {Category} from "@/types";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi
} from "@/components/ui/carousel";
import AutoHeight from "embla-carousel-auto-height"
import React, {useRef, useState} from "react";
import ProductVerticalCard from "@/components/frontend/ProductVerticalCard";

interface ProductClientMobileProps {
    categories: Category[];
}

const ProductClientMobile = ({categories}: ProductClientMobileProps) => {
    const [currentCategory, setCurrentCategory] = useState(categories[0]);
    const carouselRef = useRef<CarouselApi | null>(null);
    const tabsRef = useRef<Record<string, HTMLDivElement>>({});

    React.useEffect(() => {
        const activeElement = tabsRef.current[currentCategory.id.toString()];
        if (activeElement) {
            activeElement.scrollIntoView({
                behavior: 'smooth',   // 平滑滚动
                block: 'nearest',    // 垂直方向不动
                inline: 'center'     // 水平方向居中
            });
        }
    }, [currentCategory]);

    return (
        <div className={'w-full block px-4 md:hidden'}>
            <div
                className={`relative after:h-px after:content-[' '] after:bg-gray-400 after:absolute after:bottom-0 after:left-0 after:w-full after:z-0`}>
                <div
                    style={{'WebkitOverflowScrolling': 'touch'}}
                    className={`flex flex-row flex-nowrap gap-4 items-center overflow-x-auto overflow-y-hidden no-scrollbar z-10`}>
                    {
                        categories.map((cat, index) => (
                            <div
                                key={`category-${cat.id}`}
                                ref={(el) => {
                                    if (el) {
                                        tabsRef.current[`${cat.id}`] = el;
                                    }
                                }}
                                onClick={() => {
                                    setCurrentCategory({...cat});
                                    carouselRef.current?.scrollTo(index);
                                }}
                                className={`cursor-pointer py-2 relative whitespace-nowrap uppercase font-bold text-[18px] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.75 after:z-10 ${currentCategory.id === cat.id ? 'text-[#f19e39] after:bg-[#f19e39]' : 'text-[#67bfb9] after:bg-none'}`}
                            >
                                {cat.name}
                            </div>
                        ))
                    }
                </div>
            </div>
            <Carousel
                key={'mobile-carousel'}
                setApi={(api: CarouselApi) => {
                    if (api) {
                        api.on('select', () => {
                            setCurrentCategory(categories[api.selectedScrollSnap()]);
                        });
                        carouselRef.current = api;
                    }
                }}
                plugins={[AutoHeight()]}
                opts={{loop: true}}
            >
                <CarouselContent className="items-start transition-[height] duration-300">
                    {
                        categories.map((cat) => (
                            <CarouselItem key={`category-${cat.id}`}>
                                <div className={''}>
                                    {
                                        cat.products?.map((product) => (
                                            <ProductVerticalCard key={`product-${product.id}`} product={product}/>
                                        ))
                                    }
                                </div>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
            </Carousel>
        </div>
    );
}

export default ProductClientMobile;