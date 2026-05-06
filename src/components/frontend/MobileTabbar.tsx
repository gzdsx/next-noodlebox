'use client';

import React from 'react';
import Link from 'next/link';
import {ShoppingCart, Gift, Grid3X3, Heart, User} from 'lucide-react';
import {useCart} from '@/contexts/CartContext';
import {useCurrentUser} from "@/contexts/AppContext";
import {useLottery} from "@/contexts/LotteryContext";

export default function MobileTabbar() {
    const {totalItems} = useCart();
    const lottery = useLottery();
    const currentUser = useCurrentUser();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
            <div className="flex items-center justify-around h-14">
                <Link href="/cart" className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-crimson">
                    <div className="relative">
                        <ShoppingCart size={20}/>
                        {totalItems > 0 && (
                            <span
                                className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px]">Cart</span>
                </Link>

                <button onClick={() => lottery.open()}
                        className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-crimson">
                    <div className={'relative'}>
                        <Heart size={20}/>
                        <span
                            className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                {currentUser?.points||0}
                        </span>
                    </div>
                    <span className="text-[10px]">Lottery</span>
                </button>

                <Link href="/shop" className="flex flex-col items-center gap-0.5 text-crimson">
                    <Grid3X3 size={20}/>
                    <span className="text-[10px]">Menus</span>
                </Link>

                <Link href="/points-mall"
                      className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-crimson">
                    <Gift size={20}/>
                    <span className="text-[10px]">Points Mall</span>
                </Link>

                <Link href="/user/profile"
                      className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-crimson">
                    <User size={20}/>
                    <span className="text-[10px]">Mine</span>
                </Link>
            </div>
        </div>
    );
}
