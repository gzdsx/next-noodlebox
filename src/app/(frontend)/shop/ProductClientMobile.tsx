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
import {ShoppingCartIcon} from "lucide-react";
import {useProductModal} from "@/contexts/CartContext";

interface ProductClientMobileProps {
    categories: Category[];
}

const ProductClientMobile = ({categories}: ProductClientMobileProps) => {
    const modal = useProductModal();
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
                                            <div key={`product-${product.id}`} className={'flex flex-row gap-4 py-2'}>
                                                <div className={`w-[36vw] max-w-25`}>
                                                    <div className={`aspect-square relative`}>
                                                        <img
                                                            src={product.thumbnail}
                                                            alt={product.title}
                                                            className={`w-full h-full object-cover rounded-sm`}
                                                        />
                                                        {
                                                            product.icon === 'new' && (
                                                                <span
                                                                    className={'absolute px-2 py-1 bg-[#8743d0] text-white text-[12px] left-0 top-0'}>NEW!</span>
                                                            )
                                                        }
                                                        {
                                                            product.icon === 'hot' && (
                                                                <span
                                                                    className={'absolute px-2 py-1 bg-red-500 text-white text-[12px] left-0 top-0'}>HOT!</span>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className={'grow flex flex-col gap-2 justify-between'}>
                                                    <h3 className={'text-[16px] font-bold'}>{product.title}</h3>
                                                    <div className={'flex flex-row gap-4'}>
                                                        {
                                                            product.meta_data?.badges?.map((badge: string) => (
                                                                <img
                                                                    key={`badge-${badge}`}
                                                                    className={'w-7.5 h-7.5 object-contain'}
                                                                    src={badge}
                                                                    alt={''}
                                                                />
                                                            ))
                                                        }
                                                    </div>
                                                    <div className={'flex flex-row gap-2 items-center justify-between'}>
                                                        <span
                                                            className={'text-[16px] font-bold text-[#66beb8]'}>€{product.price}</span>
                                                        <button
                                                            onClick={() => {
                                                                modal.open(product);
                                                            }}
                                                            className={'flex items-center gap-2 bg-[#66beb8] text-white px-2 py-1.25 rounded-[5px] hover:bg-[#41918b] cursor-pointer'}>
                                                            <ShoppingCartIcon size={16}/>
                                                            <span>Add</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
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