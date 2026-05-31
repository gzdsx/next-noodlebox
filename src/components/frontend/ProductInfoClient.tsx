'use client'

import {CartOptionItem, Product, VariantItem, VariantOptionItem} from "@/types";
import {useCart, useProductModal} from "@/contexts/CartContext";
import React, {useMemo, useState} from "react";
import ProductImageGallery from "@/components/frontend/ProductImageGallery";
import {ShoppingCartIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import ProductNumberInput from "@/components/frontend/ProductNumberInput";

const spicyMap: Record<string, string> = {
    slightly: '/spicy-slightly.png',
    medium: '/spicy-medium.png',
    super: '/spicy-super.png',
}

export const ProductInfoClient = ({product, scrollViewStyle}: {
    product: Product,
    scrollViewStyle?: React.CSSProperties
}) => {
    const {addItem} = useCart();
    const productModal = useProductModal();
    const [quantity, setQuantity] = useState(1);
    const [variants, setVariants] = useState<VariantItem[]>(product.variation_list || []);
    const [additionalOptions, setAdditionalOptions] = useState<VariantOptionItem[]>(product.additional_options || []);
    const [usePoints, setUsePoints] = useState(false);

    const skuData = useMemo(() => {
        const options: CartOptionItem[] = [];
        const additional_options: CartOptionItem[] = [];
        let price: number = Number(product.price);
        variants.forEach((variant: VariantItem) => {
            variant.options.forEach((option: VariantOptionItem) => {
                if (option.selected) {
                    price += Number(option.price);
                    options.push({
                        name: variant.name,
                        value: option.title,
                        price: option.price,
                    })
                }
            })
        })

        additionalOptions.forEach((option: VariantOptionItem) => {
            if (option.selected) {
                price += Number(option.price);
                additional_options.push({
                    name: option.title,
                    price: option.price,
                })
            }
        })

        if (usePoints) price = 0;

        return {price, options, additional_options};
    }, [additionalOptions, product.price, usePoints, variants]);

    const totalPoints = useMemo(() => {
        return Number(product.point_price) * quantity;
    }, [product.point_price, quantity]);

    const metas = product.metas?.reduce((acc, meta) => {
        acc[meta.key] = meta.value;
        return acc;
    }, {}) || {};

    const handleAddToCart = async () => {
        try {
            addItem({
                product_id: product.id,
                product_type: 'product',
                quantity,
                price: skuData.price,
                options: skuData.options,
                additional_options: skuData.additional_options,
                purchase_via: usePoints ? 'point' : 'cash',
            });
            productModal.close();
        } catch (e) {

        }
    };

    const renderBadges = () => {
        if (!metas.badges?.length) {
            return null;
        }

        return (
            <div className={'flex flex-row gap-2'}>
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
        )
    }

    const renderVariants = () => {
        if (!variants.length) {
            return null;
        }

        return (
            <div className={'flex flex-col gap-2'}>
                {
                    variants?.map((variation: VariantItem, index) => (
                        <div key={`variation-${variation.name}`}>
                            <div className={`text-white font-bold mb-2`}>{variation.name}</div>
                            <div className={`flex flex-row flex-wrap gap-2`}>
                                {
                                    variation.options?.map((option: VariantOptionItem, idx) => (
                                        <span
                                            key={`option-${variation.name}-${option.title}`}
                                            className={`px-2 py-2 cursor-pointer whitespace-nowrap rounded-md border border-[#66beb8] text-[12px] font-light ${option.selected ? 'bg-[#66beb8] text-white' : 'text-[#66beb8]'}`}
                                            onClick={() => {
                                                setVariants(prev => prev.map((item, i) => {
                                                    if (i === index) {
                                                        return {
                                                            ...item,
                                                            options: item.options.map((opt, j) => {
                                                                return {...opt, selected: j === idx};
                                                            })
                                                        }
                                                    }
                                                    return item;
                                                }))
                                            }}
                                        >{option.title}</span>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }

    const renderAdditionalOptions = () => {
        if (!additionalOptions.length) {
            return null;
        }

        return (
            <div key={`product-additional-options`}>
                <div className={`text-white font-bold mb-2`}>{'Additional Options'}</div>
                <div className={`flex flex-row flex-wrap gap-2`}>
                    {
                        additionalOptions?.map((option: VariantOptionItem, index) => (
                            <span
                                key={`additional-option-${option.title}`}
                                className={`px-2 py-2 cursor-pointer whitespace-nowrap rounded-md border border-[#66beb8] text-[12px] font-light ${option.selected ? 'bg-[#66beb8] text-white' : 'text-[#66beb8]'}`}
                                onClick={() => {
                                    setAdditionalOptions(prev => prev.map((item, i) => {
                                        if (i === index) {
                                            return {...item, selected: !item.selected};
                                        }
                                        return item;
                                    }))
                                }}
                            >{option.title}</span>
                        ))
                    }
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={'hidden md:block relative'}>
                <ProductImageGallery images={product.images}/>
                {product.icon && (
                    <Badge variant="destructive" className="absolute top-2 left-2 text-sm m-0">
                        {product.icon}
                    </Badge>
                )}
                {
                    spicyMap[metas.spicy] && (
                        <img src={spicyMap[metas.spicy]} className={'absolute top-2 right-2 w-[36px] h-[36px]'}
                             alt={metas.spicy}/>
                    )
                }
            </div>
            <div className="space-y-4">
                <div className={'flex flex-row md:flex-col gap-4'}>
                    <div className={'md:hidden relative'}>
                        <img
                            src={product.thumbnail}
                            className={'w-25 h-25 object-cover'}
                            alt={product.title}
                        />
                        {product.icon && (
                            <Badge variant="destructive" className="absolute top-1 left-1 text-xs m-0">
                                {product.icon}
                            </Badge>
                        )}
                        {
                            spicyMap[metas.spicy] && (
                                <img src={spicyMap[metas.spicy]} className={'absolute top-1 right-1 w-[24px] h-[24px]'}
                                     alt={metas.spicy}/>
                            )
                        }
                    </div>
                    <div className={'space-y-4'}>
                        <h1 className="text-1xl font-bold mb-2 md:text-2xl">{product.title}</h1>
                        <div className={'bg-[#66beb8] px-4 py-2 rounded text-white'}>
                            Earn Points : {metas.earn_points} Points
                        </div>
                        <div className={'rounded text-[#71f4fd] font-bold text-2xl'}>
                            {usePoints ? totalPoints + ' Noodle Box Points' : `€` + skuData.price.toFixed?.(2)}
                        </div>
                    </div>
                </div>
                <div className={'space-y-4'} style={scrollViewStyle}>
                    <div dangerouslySetInnerHTML={{__html: product.description}} className={'text-[#f19e39]'}></div>
                    {renderBadges()}
                    {renderVariants()}
                    {renderAdditionalOptions()}

                    {
                        product.allow_point_purchase && (
                            <div className={'block'}>
                                <label className={'flex flex-row gap-2 items-center'}>
                                    <input
                                        type={'checkbox'}
                                        className={'transform scale-150'}
                                        onChange={(e) => setUsePoints(e.target.checked)}
                                    />
                                    <span
                                        className={'text-[#f19e39]'}>Use {totalPoints} Noodle Box Points for purchasing this Product</span>
                                </label>
                            </div>
                        )
                    }


                    <div className="flex items-center gap-3 mt-8">
                        <ProductNumberInput
                            min={1}
                            max={99999}
                            value={quantity}
                            onChange={val => setQuantity(val)}
                        />
                        <button
                            onClick={handleAddToCart}
                            className={'flex cursor-pointer bg-[#be2e2d] text-white px-4 py-2 rounded-md items-center gap-2 hover:bg-red-800'}
                        >
                            <ShoppingCartIcon/>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};