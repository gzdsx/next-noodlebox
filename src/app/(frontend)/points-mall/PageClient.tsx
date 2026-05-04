'use client'

import {Category} from "@/types";
import React, {useState} from "react";
import ProductCard from "@/components/frontend/ProductCard";

const PageClient = ({categories = []}: { categories: Category[] }) => {
    const [currentCategory, setCurrentCategory] = useState(categories[0]);

    const backgrounds = [
        'linear-gradient(to right, #146d00 0%, #b5ce10 50%, #146d00 100%)',
        'linear-gradient(to right, #9b8723 0%, #afcd3b 50%, #9b8723 100%)',
        'linear-gradient(to right, #357ce8 0%, #0fbdc6 50%, #357ce8 100%)',
        'linear-gradient(to right, #e83565 0%, #f70e0e 50%, #e83565 100%)',
        'linear-gradient(to right, #8d22a5 0%, #e21292 50%, #8d22a5 100%)',
        'linear-gradient(to right, #dd3333 0%, #bf780f 50%, #dd3333 100%)',
        'linear-gradient(to right, #c18b2c 0%, #a3ba0e 50%, #c18b2c 100%)',
        'linear-gradient(to right, #2b155b 0%, #8600c4 50%, #2b155b 100%)',
        'linear-gradient(to right, #29b262 0%, #10ceb8 50%, #29b262 100%)'
    ];
    return (
        <div className={'w-full mx-auto px-4'}>
            <div className={'h-20'}></div>
            <div
                className={`relative mb-4 md:hidden after:h-px after:content-[' '] after:bg-gray-400 after:absolute after:bottom-0 after:left-0 after:w-full after:z-0`}>
                <div
                    style={{'WebkitOverflowScrolling': 'touch'}}
                    className={`flex flex-row flex-nowrap gap-4 items-center overflow-x-auto overflow-y-hidden no-scrollbar z-10`}>
                    {
                        categories.map((cat, index) => (
                            <div
                                key={`category-${cat.id}`}
                                ref={(el) => {

                                }}
                                onClick={() => {
                                    setCurrentCategory({...cat});
                                    //carouselRef.current?.scrollTo(index);
                                }}
                                className={`cursor-pointer py-2 relative whitespace-nowrap uppercase font-bold text-[18px] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.75 after:z-10 ${currentCategory.id === cat.id ? 'text-[#f19e39] after:bg-[#f19e39]' : 'text-[#67bfb9] after:bg-none'}`}
                            >
                                {cat.name}
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className={'flex flex-col md:flex-row gap-x-4'}>
                <div className={'w-[300px] min-w-[300px] max-w-[300px] hidden md:flex flex-col gap-y-2'}>
                    <h2 className={'text-[24px] font-bold text-[#f19e39] mb-4 uppercase'}>Points Mall</h2>
                    {
                        categories.map((cat, index) => (
                            <button
                                key={`category-${cat.id}`}
                                style={{
                                    'backgroundImage': backgrounds[index],
                                    'transition': 'all .2s ease-in-out',
                                    'backgroundSize': '200% 100%'
                                }}
                                className={`py-3 rounded text-left pl-4 cursor-pointer`}
                                onClick={() => setCurrentCategory({...cat})}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundPositionX = '100%';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundPositionX = '0%';
                                }}
                            >
                                <span className={`text-white font-normal`}>{cat.name}</span>
                            </button>
                        ))
                    }
                </div>
                <div className={'grow'}>
                    <h2 className={'hidden md:block text-[30px] font-bold text-white text-center mb-6'}>{currentCategory.name}</h2>
                    <div className={'grid grid-cols-2 md:grid-cols-5 gap-4'}>
                        {
                            currentCategory.products?.map((product) => (
                                <ProductCard key={`product-${product.id}`} product={product}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageClient;