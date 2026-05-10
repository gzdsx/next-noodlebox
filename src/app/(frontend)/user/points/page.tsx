'use client';

import {useEffect, useState} from "react";
import {apiGet} from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import CustomPagination from "@/components/frontend/CustomPagination";

export default function Page() {
    const [pointsData, setPointsData] = useState<any>({
        points: 0,
        referralLink: '',
        referral_points: '',
        referral_link_description: ''
    });

    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);

    const fetchPointsData = () => {
        apiGet(`/my/points`).then(res => {
            setPointsData((pointsData: any) => ({...pointsData, ...res.data}));
        }).catch(() => {

        });
    }

    const fetchTransactions = () => {
        apiGet(`/my/points/transactions`, {
            offset,
            limit: 20
        }).then(res => {
            setTransactions(res.data.items);
            setTotal(res.data.total);
        }).catch(() => {
            console.error('Failed to fetch transactions');
        });
    }

    const columns = [
        {key: 'detail', label: 'Detail', width: 'auto'},
        {key: 'points', label: 'Points', width: 100},
        {key: 'time', label: 'Time', width: 150},
    ]

    useEffect(() => {
        fetchPointsData();
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [offset]);
    return (
        <>
            <h1 className="text-2xl font-bold mb-6">My Points</h1>
            <div className={'bg-black/80 p-4 rounded-md text-[#f19e39] text-[18px]'}>
                <div dangerouslySetInnerHTML={{__html: pointsData.referral_link_description}}></div>
            </div>

            <h1 className="text-2xl font-bold my-6">Points Records</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map(column => (
                            <TableHead key={column.key} style={{width: column.width, color: '#fff', fontSize: 16}}>
                                {column.label}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map(transaction => (
                        <TableRow key={`trans-${transaction.id}`}>
                            <TableCell className={'py-3'}>{transaction.detail}</TableCell>
                            <TableCell
                                className={`${transaction.type == 1 ? 'text-[#66beb8]' : 'text-[#f19e39]'}`}>{transaction.type == 1 ? '+' : '-'}{transaction.points}</TableCell>
                            <TableCell>{transaction.created_at}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <CustomPagination
                total={total}
                currentPage={1}
                pageSize={20}
                onChange={page => {
                    setOffset((page - 1) * 20);
                }}
            />
        </>
    );
}