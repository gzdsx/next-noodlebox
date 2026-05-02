'use client'

import Link from "next/link";
import {useCategories} from "@/contexts/AppContext";


const CategoryClient = () => {
    const categories = useCategories();
    return (
        <section className="w-full px-4 py-6">
            <div className="container-fluid position-relative">
                <h5 className="text-center font-bold text-[18px] text-[#71f4fd] mb-4">
                    What happens when fresh ingredients meet the
                    fiery theatre of the wok?
                </h5>
                <div className="grid grid-cols-5 md:flex md:flex-nowrap gap-4">
                    {
                        categories.map((cat) => (
                            <div
                                key={`category-${cat.id}`}
                                className="grow after:block after:pt-[100%] after:content-[' '] relative"
                            >
                                <Link href={`/category/${cat.slug}`}>
                                    <div
                                        style={{'borderStyle': 'outset'}}
                                        className={'absolute left-0 top-0 w-full h-full bg-[#444] rounded-full border-[6px] border-[#3cc497]'}>
                                        <div className={'w-full h-full flex items-center justify-center'}>
                                            <img src={cat.thumbnail} className={'w-[60%] h-[60%] block'} alt=""/>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    );
};

export default CategoryClient;