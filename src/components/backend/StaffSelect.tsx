'use client';

import {Select, SelectProps} from "antd";
import {useEffect, useState} from "react";
import {DefaultOptionType} from "@rc-component/select/lib/Select";
import {apiGet} from "@/lib/backendApi";

const StaffSelect = (props:SelectProps) => {
    const [options, setOptions] = useState<DefaultOptionType[]>([]);

    const fetchStaffs = () => {
        apiGet(`/staff/staffs`).then(response => {
            setOptions(response.data.items.map((m: any) => ({
                label: m.name,
                value: m.id,
            })));
        })
    }

    useEffect(() => {
        fetchStaffs();
    }, []);

    return (
        <Select
            {...props}
            options={options}
        />
    );
};

export default StaffSelect;