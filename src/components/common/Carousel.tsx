'use client';

import Link from "next/link";
import { Carousel as AntdCarousel} from 'antd';

export interface Slide {
    id: number;
    thumbnail: string;
    link: string;
    description: string;
}

interface CarouselProps {
    slides?: Slide[];
}

export default function Carousel({slides = []}: CarouselProps) {
    // Placeholder carousel with static images

    return (
        <AntdCarousel
            autoplay
            draggable={true}
            dots={true}
        >
            {slides.map((slide: Slide, index) => (
                <div key={slide.id} className="w-full h-[40vw] md:h-[30vw]">
                    <Link key={slide.id} href={slide.link} prefetch={false} target="_blank">
                        <img
                            key={index}
                            src={slide.thumbnail}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </Link>
                </div>
            ))}
        </AntdCarousel>
    );
}
