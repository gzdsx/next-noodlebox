'use client';

import {Product} from "@/types";
import {ShoppingCartIcon} from "lucide-react";
import React from "react";
import {spicyMap} from "@/components/frontend/ProductCard";
import {useProductModal} from "@/contexts/CartContext";

const ProductVerticalCard = ({product}: { product: Product }) => {
    const modal = useProductModal();
    const metas = product.metas?.reduce((acc, meta) => {
        acc[meta.key] = meta.value;
        return acc;
    }, {}) || {};

    return (
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
                                className={'absolute px-1 py-1 bg-[#8743d0] text-white text-[10px] left-0 top-0'}>NEW!</span>
                        )
                    }
                    {
                        product.icon === 'hot' && (
                            <span
                                className={'absolute px-1 py-1 bg-red-500 text-white text-[10px] left-0 top-0'}>HOT!</span>
                        )
                    }
                    {
                        spicyMap[metas.spicy] && (
                            <img src={spicyMap[metas.spicy]} className={'absolute top-0 right-0 w-[24px] h-[24px]'} alt={metas.spicy}/>
                        )
                    }
                </div>
            </div>
            <div className={'grow flex flex-col gap-2 justify-between'}>
                <h3 className={'text-[16px] font-bold'}>{product.title}</h3>
                <div className={'flex flex-row gap-1'}>
                    {
                        metas.badges?.map((badge: string) => (
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
                    <span className={'text-[16px] font-bold text-[#66beb8]'}>€{product.price}</span>
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
    );
};

export default ProductVerticalCard;