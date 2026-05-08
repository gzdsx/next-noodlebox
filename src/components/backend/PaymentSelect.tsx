'use client';

import {Select, SelectProps} from "antd";
import {apiGet} from "@/lib/backendApi";
import {useEffect, useState} from "react";
import {DefaultOptionType} from "@rc-component/select/lib/Select";

const PaymentSelect = (props: SelectProps) => {
    const [options, setOptions] = useState<DefaultOptionType[]>([]);

    const fetchMethods = () => {
        apiGet(`/options/payment-methods`).then(response => {
            setOptions([
                ...Object.values(response.data).map((m: any) => ({
                    label: m.title,
                    value: m.id,
                }))
            ])
        })
    }

    useEffect(() => {
        fetchMethods();
    }, []);

    return (
        <Select
            {...props}
            mode="tags"
            options={options}
        />
    );
};

export default PaymentSelect;