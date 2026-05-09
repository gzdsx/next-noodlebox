'use client';

import Link from "next/link";
import {Button} from "antd";

export default function Page() {
    return (
        <div className={'w-full h-full flex items-center justify-center gap-8'}>
            <Link href={'/admin/orders/allocation'}>
                <Button
                    variant={'solid'}
                    color={'primary'}
                    style={{width: 240, height: 80, fontSize: 22}}
                >Shipping Allocation</Button>
            </Link>
            <Link href={'/admin/orders/collection'}>
                <Button
                    variant={'solid'}
                    color={'volcano'}
                    style={{width: 240, height: 80, fontSize: 22}}
                >Collection Orders</Button>
            </Link>
            <Link href={'/admin/orders/takeaway'}>
                <Button
                    variant={'solid'}
                    color={'magenta'}
                    style={{width: 240, height: 80, fontSize: 22}}
                >Takeaway Orders</Button>
            </Link>
        </div>
    )
}