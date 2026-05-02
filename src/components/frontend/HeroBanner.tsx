'use client';

import React from 'react';
import Link from 'next/link';
import {ShoppingBag, Gift} from 'lucide-react';

export default function HeroBanner() {
    return (
        <section className="relative w-full h-screen min-h-150 overflow-hidden">
            {/* Video Background */}
            <video
                src="https://www.noodlebox.ie/storage/video/2024/04/kwiLVFCL6im9jE3SOoC7df0EVX3cZWy91tru8y96.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40"/>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <img
                    src="https://www.noodlebox.ie/storage/image/2024/04/EorwaqdQLuw4FZ7vxOL3rcLne0pXvI8NMNenWDYq.png"
                    alt="Noodle Box"
                    className="w-48 md:w-64 mb-8"
                />
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Order Online!
                </h3>
                <h3 className="text-2xl md:text-3xl font-bold text-orange-400 mb-10">
                    Choose The Shop Closest To You
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-crimson hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
                    >
                        <ShoppingBag size={22}/>
                        <span>DROGHEDA SHOP</span>
                    </Link>
                    <Link
                        href="/points-mall"
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
                    >
                        <Gift size={22}/>
                        <span>POINTS MALL</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
