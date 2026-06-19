'use client';

import {Checkbox} from "antd";
import {CheckboxGroupProps} from "antd/es/checkbox";
import {apiGet} from "@/lib/backendApi";
import {useQuery} from "@tanstack/react-query";

const PaymentCheckboxGroup = (props: Omit<CheckboxGroupProps, 'options'>) => {

    const {data: response} = useQuery({
        queryKey: ['payment-methods'],
        queryFn: () => apiGet(`/payment-methods`)
    });

    const options = response?.data.map((item: any) => ({
        label: item.title,
        value: item.id,
        type: item.type,
        fee: item.fee
    })) || [];

    return (
        <Checkbox.Group
            {...props}
            options={options}
        />
    );
};

export default PaymentCheckboxGroup;