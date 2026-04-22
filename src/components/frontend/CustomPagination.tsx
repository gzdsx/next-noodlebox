'use client';

import {Pagination} from 'antd';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';

export default function CustomPagination({total, current, pageSize}: {
    total: number;
    current: number,
    pageSize: number
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const onChange = (page: number) => {
        // 保持现有的其他搜索参数，仅修改 page
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());

        // 触发路由跳转，这会导致服务器组件重新渲染数据
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="py-6 flex justify-center">
            <Pagination
                current={current}
                total={total}
                pageSize={pageSize}
                onChange={onChange}
                showSizeChanger={false}
                // 如果你需要暗黑模式，确保外层有 ConfigProvider
            />
        </div>
    );
}
