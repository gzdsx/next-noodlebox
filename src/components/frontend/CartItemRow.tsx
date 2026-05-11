'use client';

import React, {useMemo} from 'react';
import {NumberInput} from '@/components/ui/number-input';
import {Button} from '@/components/ui/button';
import {Trash2} from 'lucide-react';
import {useCart} from '@/contexts/CartContext';
import {useTranslations} from '@/contexts/LocaleContext';
import {CartItem} from "@/types";

export default function CartItemRow({item}: { item: CartItem }) {
    const {updateQuantity, removeItem} = useCart();
    const {t} = useTranslations('ecommerce');

    const optionNames: string[] = useMemo(() => {
        const names: string[] = [];
        const regex = /^(?!.*(none|original)).*$/i;
        try {
            //console.log('item.options', item.options);
            if (Array.isArray(item.options)) {
                item.options.forEach(option => {
                    if (regex.test(option.value || '')) {
                        names.push(option.value as string);
                    }
                });
            }

            if (Array.isArray(item.additional_options)) {
                item.additional_options?.forEach?.(option => {
                    if (regex.test(option.name)) {
                        names.push(option.name);
                    }
                })
            }
        } catch (e) {
            console.error((e as Error).message);
        }
        return names;
    }, [item.additional_options, item.options]);

    return (
        <div className="flex items-start gap-4 py-4 border-b border-gray-300 relative">
            {/* Image */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="object-cover w-full h-full"
                        sizes="80px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs">
                        {t('product.noImage')}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
                <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
                {
                    optionNames.length > 0 && (
                        <div className="text-gray-300 text-sm leading-4">
                            {optionNames.join(', ')}
                        </div>
                    )
                }
                {
                    item.purchase_via == 'point' && (
                        <div className="text-[#f19e39] text-sm leading-4">
                            Purchase via Points
                        </div>
                    )
                }

                {
                    item.purchase_via == 'lottery' && (
                        <div className="text-[#f19e39] text-sm leading-4">
                            Lottery Prize
                        </div>
                    )
                }
                <div className={'md:hidden'}>
                    <NumberInput
                        min={1}
                        max={999}
                        value={item.quantity}
                        onChange={val => updateQuantity(item.id || 0, val)}
                    />
                </div>
            </div>

            {/* Price */}
            <div className="text-sm font-medium shrink-0 w-16">
                <p className={'text-right'}>€{item.price}</p>
                <p className="text-right md:hidden">{'x' + item.quantity}</p>
            </div>

            {/* Quantity */}
            <div className="shrink-0 hidden md:block w-34">
                <NumberInput
                    min={1}
                    max={999}
                    value={item.quantity}
                    onChange={val => updateQuantity(item.id || 0, val)}
                />
            </div>

            {/* Subtotal */}
            <div className="text-sm font-semibold shrink-0 w-20 text-right hidden md:block">
                €{(item.price * item.quantity).toFixed(2)}
            </div>

            {/* Remove */}
            <div className={'w-8 hidden md:block'}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 items-center justify-center text-destructive hover:text-destructive hidden md:flex"
                    onClick={() => removeItem(item.id || 0)}
                >
                    <Trash2 size={16}/>
                </Button>
            </div>

            <div
                className={'md:hidden absolute right-2 bottom-6'}
                onClick={() => removeItem(item.id || 0)}
            >
                <Trash2 size={20} color={'red'}/>
            </div>
        </div>
    );
}
