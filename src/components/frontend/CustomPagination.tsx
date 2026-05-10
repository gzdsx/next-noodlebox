'use client';

import React, {useState} from 'react';
import {
    Pagination as PaginationRoot,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
    PaginationPrevious,
    PaginationNext,
} from '@/components/ui/pagination';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';

export default function CustomPagination({total, currentPage, pageSize, onChange: onPageChange, redirect = false}: {
    total: number;
    currentPage: number,
    pageSize: number,
    onChange?: (page: number) => void,
    redirect?: boolean
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [current, setCurrent] = useState(currentPage || 1);

    const totalPages = Math.ceil(total / pageSize);

    const onChange = (page: number) => {
        setCurrent(page);
        if (redirect) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', page.toString());
            router.push(`${pathname}?${params.toString()}`);
        } else {
            onPageChange?.(page);
        }
    };

    if (totalPages <= 1) return null;

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (current > 3) pages.push('ellipsis');
            const start = Math.max(2, current - 1);
            const end = Math.min(totalPages - 1, current + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (current < totalPages - 2) pages.push('ellipsis');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="py-6 flex justify-center">
            <PaginationRoot>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => current > 1 && onChange(current - 1)}
                            className={current <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                    {getPageNumbers().map((page, i) => (
                        <PaginationItem key={i}>
                            {page === 'ellipsis' ? (
                                <PaginationEllipsis/>
                            ) : (
                                <PaginationLink
                                    isActive={page === current}
                                    onClick={() => onChange(page)}
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => current < totalPages && onChange(current + 1)}
                            className={current >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </PaginationRoot>
        </div>
    );
}
