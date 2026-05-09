'use client';

import {useEffect, useState} from "react";
import {Checkbox} from "antd";
import {CheckboxGroupProps} from "antd/es/checkbox";
import {CheckboxOptionType} from "antd/es/checkbox/Group";
import {apiGet} from "@/lib/backendApi";

const PaymentCheckboxGroup = (props: CheckboxGroupProps) => {
    const [options, setOptions] = useState<CheckboxOptionType[]>([]);

    const fetchOptions = () => {
        apiGet(`/payment-methods`).then(response => {
            setOptions(response.data.map((item: any) => ({
                label: item.title,
                value: item.id,
                type: item.type,
                fee: item.fee
            })))
        })
    }

    useEffect(() => {
        fetchOptions();
    }, []);

    return (
        <Checkbox.Group
            {...props}
            options={options}
        />
    );
};

export default PaymentCheckboxGroup;