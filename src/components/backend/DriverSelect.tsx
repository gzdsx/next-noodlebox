'use client';

import {useEffect, useState} from "react";
import {Select, SelectProps} from "antd";
import {DefaultOptionType} from "@rc-component/select/lib/Select";
import {apiGet} from "@/lib/backendApi";

const DriverSelect = (props: SelectProps) => {
    const [options, setOptions] = useState<DefaultOptionType[]>([]);

    const fetchDrivers = () => {
        apiGet(`/deliveryers`, {limit: 100}).then(response => {
            setOptions([
                {
                    label: 'All Drivers',
                    value: 'all'
                },
                ...response.data.items.map((m: any) => ({
                    label: m.name,
                    value: m.id
                }))
            ])
        })
    }

    useEffect(() => {
        fetchDrivers();
    }, []);

    return (
        <Select
            {...props}
            options={options}
        />
    );
};

export default DriverSelect;