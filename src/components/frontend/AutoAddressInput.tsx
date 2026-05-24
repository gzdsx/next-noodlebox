'use client';

import React, {useState} from "react";
import {apiGet} from "@/lib/api";
import {Input} from "@/components/ui/input";

const AutoAddressInput = ({defaultValue, onChange}: {
    defaultValue: string,
    onChange: (value: { eircode: string, address: string }) => void
}) => {
    const [items, setItems] = useState<any[]>([]);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [inputValue, setInputValue] = useState<string>(defaultValue);
    const tokenRef = React.useRef<string | null>(null);
    const abortRef = React.useRef<AbortController | null>(null);

    const fetchToken = async () => {
        try {
            const response = await apiGet(`/autoaddress/createtoken`);
            localStorage.setItem('autoaddress_token', response.data.token);
            tokenRef.current = response.data.token;
        } catch {

        }
    }

    const searchAddress = async (address: string) => {
        if (!tokenRef.current) {
            await fetchToken();
        }

        if (abortRef.current) {
            abortRef.current.abort();
        }
        abortRef.current = new AbortController();
        const queryStr = `country=IE&address=${address}&token=${tokenRef.current}`;
        fetch(`https://api.autoaddress.com/3.0/autocomplete?${queryStr}`, {
            signal: abortRef.current.signal
        }).then(response => response.json()).then(data => {
            // this.items = [...this.items, ...data.options.map(o => ({
            //     address: o.value,
            //     link: o.link.href
            // }))];
            setItems(
                data.options.map((o: any) => ({
                    address: o.value,
                    link: o.link.href
                }))
            )
        }).catch(e => {
            fetchToken();
        });
    }

    const selectAddress = (item: any) => {
        if (item.link) {
            fetch(item.link).then(response => response.json())
                .then(data => {
                    //console.log(data);
                    const {type, options} = data;
                    if (type === 'lookup') {
                        const eircode = data.address.postcode?.value;
                        const address = data.address.label?.join(',');

                        setInputValue(address);
                        setShowSuggestion(false);
                        onChange?.({eircode, address});
                    } else {
                        if (options) {
                            setItems(
                                options.map((o: any) => {
                                    return {
                                        address: o.value,
                                        link: o.link.href
                                    }
                                })
                            )
                        }
                    }
                });
        } else {
            onChange?.({
                eircode: '',
                address: item.address
            });
            setShowSuggestion(false);
        }
    }

    return (
        <div className={'relative'}>
            <Input
                className={'h-11'}
                value={inputValue}
                onChange={(e) => {
                    const address = e.target.value;
                    if (address && address.length > 2) {
                        searchAddress(address);
                    } else {
                        setItems([]);
                    }
                    setInputValue(address);
                }}
                onFocus={() => setShowSuggestion(true)}
            />
            {
                showSuggestion && items.length > 0 && (
                    <div
                        className={'absolute top-full bg-white mt-1 shadow-sm rounded-sm left-0 w-full z-10 overflow-hidden'}>
                        {
                            items.map((item: any) => (
                                <div key={item.address} className={'p-2 text-gray-500 hover:bg-gray-100 cursor-pointer'}
                                     onClick={() => {
                                         selectAddress(item);
                                     }}>{item.address}</div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
};

export default AutoAddressInput;