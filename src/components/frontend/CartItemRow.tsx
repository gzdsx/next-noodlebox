'use client';

import React from 'react';
import Image from 'next/image';
import {InputNumber, Button} from 'antd';
import {Trash2} from 'lucide-react';
import {CartItem, useCart} from '@/contexts/CartContext';
import {useTranslations} from '@/contexts/LocaleContext';

interface CartItemRowProps {
    item: CartItem;
}

export default function CartItemRow({item}: CartItemRowProps) {
    const {updateQuantity, removeItem} = useCart();
    const {t} = useTranslations('ecommerce');

    return (
        <div className="flex items-center gap-4 py-4 border-b border-gray-100">
            {/* Image */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                {item.thumbnail ? (
                    <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        {t('product.noImage')}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</h3>
                {item.sku_name && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-xs text-gray-400">
                            {item.sku_name}
                        </span>
                    </div>
                )}
            </div>

            {/* Price */}
            <div className="text-sm font-medium text-red-500 shrink-0">
                ¥{item.price}
            </div>

            {/* Quantity */}
            <div className="shrink-0">
                <InputNumber
                    min={1}
                    max={999}
                    value={item.quantity}
                    onChange={val => updateQuantity(item.product_id, val || 1, item.sku_id)}
                    size="small"
                    className="w-24!"
                />
            </div>

            {/* Subtotal */}
            <div className="text-sm font-semibold text-gray-900 shrink-0 w-20 text-right">
                ¥{(item.price * item.quantity).toFixed(2)}
            </div>

            {/* Remove */}
            <Button
                type="text"
                danger
                icon={<Trash2 size={16}/>}
                onClick={() => removeItem(item.product_id, item.sku_id)}
                className="shrink-0!"
            />
        </div>
    );
}
