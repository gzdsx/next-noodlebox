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
        item.options?.forEach(option => {
            if (regex.test(option.value || '')) {
                names.push(option.value as string);
            }
        });

        item.additional_options?.forEach(option => {
            if (regex.test(option.name)) {
                names.push(option.name);
            }
        })
        return names;
    }, [item.additional_options, item.options]);

    return (
        <div className="flex items-center gap-4 py-4 border-b border-gray-100">
            {/* Image */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                {item.thumbnail ? (
                    <img
                        src={item.thumbnail}
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
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
                {
                    optionNames.map((name, index) => (
                        <div key={`option-name-${index}`} className="py-1 text-gray-200 text-sm">
                            {`--${name}`}
                        </div>
                    ))
                }
                {item.sku_name && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-xs">
                            {item.sku_name}
                        </span>
                    </div>
                )}
            </div>

            {/* Price */}
            <div className="text-sm font-medium shrink-0">
                €{item.price}
            </div>

            {/* Quantity */}
            <div className="shrink-0 w-34">
                <NumberInput
                    min={1}
                    max={999}
                    value={item.quantity}
                    onChange={val => updateQuantity(item.key, val)}
                />
            </div>

            {/* Subtotal */}
            <div className="text-sm font-semibold shrink-0 w-20 text-right">
                €{(item.price * item.quantity).toFixed(2)}
            </div>

            {/* Remove */}
            <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive hover:text-destructive"
                onClick={() => removeItem(item.key)}
            >
                <Trash2 size={16}/>
            </Button>
        </div>
    );
}
