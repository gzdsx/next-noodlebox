'use client';

import React from 'react';
import Link from 'next/link';
import {HandCoins} from 'lucide-react';

export default function MapSection() {
    return (
        <section className="relative w-full">
            {/* Map */}
            <div className="w-full h-100 md:h-125">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2361.1678905288245!2d-6.357203784027461!3d53.71527145471395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4867398a1da33dd7%3A0xf99a601514c74d7e!2sDao%20Noodle%20Box!5e0!3m2!1szh-CN!2sie!4v1590345310109!5m2!1szh-CN!2sie"
                    className="w-full h-full border-0"
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex={0}
                    loading="lazy"
                />
            </div>

            {/* CTA Button overlay */}
            <div className="flex justify-center -mt-12 relative z-10">
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-crimson hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg shadow-lg"
                >
                    <HandCoins size={22}/>
                    <span>Order From DROGHEDA SHOP</span>
                </Link>
            </div>
        </section>
    );
}
