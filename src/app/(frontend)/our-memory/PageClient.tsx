'use client';

import React, {useState} from "react";
import Lightbox from "yet-another-react-lightbox";
import CustomPagination from "@/components/frontend/CustomPagination";

interface PageClientProps {
    images: { id: number; src: string; thumbnail: string, name: string }[];
    total?: number;
    page?: number;
}

const PageClient = ({images = [], page = 1, total = 0}: PageClientProps) => {
    const [open, setOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    return (
        <>
            <div className={'w-full p-4'}>
                <div className={'min-h-20'}></div>
                <h1 className={'text-center text-4xl font-bold mb-6'}>Our Memory</h1>
                <div className={'grid grid-cols-2 md:grid-cols-6 gap-4'}>
                    {
                        images?.map((image, index) => (
                            <div key={image.thumbnail} className={'relative after:block after:pt-[100%]'}
                                 onClick={() => {
                                     setImageIndex(index);
                                     setOpen(true);
                                 }}>
                                <img src={image.src} alt={image.name}
                                     className={'w-full h-full object-cover absolute top-0 left-0'}/>
                            </div>
                        ))
                    }
                </div>
                <CustomPagination total={total} currentPage={page} pageSize={30} redirect={true}/>
            </div>
            <Lightbox
                open={open}
                index={imageIndex}
                close={() => setOpen(false)}
                slides={images}
                controller={{
                    // closeOnBackdropClick 默认为 true
                    closeOnBackdropClick: true,
                    // closeOnPullDown 允许在移动端下拉关闭
                    closeOnPullDown: true,
                }}
            />
        </>
    );
};

export default PageClient;