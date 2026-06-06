'use client';

import React, {useEffect, useState} from "react";
import {apiGet} from "@/lib/api";
import {Input} from "@/components/ui/input";

// 1. 定义你要求的严格先后顺序
const eircodeOrder = ["A91", "A92", "C15", "A82", "A83", "A84", "A85", "A86"];
// 2. 去掉 ^ 的大正则，用来全局搜寻包含的字符
const eircodeRegex = /(A91|A92|C15|A82|A83|A84|A85|A86)/i;
const AutoAddressInput = ({defaultValue, onChange}: {
    defaultValue: string,
    onChange: (value: {
        eircode?: string,
        address?: string
    }) => void
}) => {
    const [items, setItems] = useState<any[]>([]);
    const [noodleboxItems, setNoodleboxItems] = useState<any[]>([]);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [inputValue, setInputValue] = useState<string>(defaultValue);
    const tokenRef = React.useRef<string | null>(null);
    const abortRef = React.useRef<AbortController | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const queryTaskRef = React.useRef<AbortController | null>(null);

    const addressSort = (a: any, b: any) => {
        const getWeight = (obj: any) => {
            const fullAddress = obj.address || "";

            // ✨ 正则大显身手：在整个字符串里搜索包含的关键字
            const match = fullAddress.match(eircodeRegex);

            if (match) {
                // match[0] 就是被命中的那个字符（例如 "C15" 或 "A92"）
                const foundPrefix = match[0].toUpperCase();
                return eircodeOrder.indexOf(foundPrefix); // 返回它在数组里的索引作为权重
            }

            return 999; // 完全不包含的，统一扔到最后面
        };

        return getWeight(a) - getWeight(b);
    }

    const fetchToken = async () => {
        try {
            const response = await apiGet(`/autoaddress/createtoken`);
            localStorage.setItem('autoaddress_token', response.data.token);
            tokenRef.current = response.data.token;
        } catch {

        }
    }

    const queryAddress = async (keywords: string) => {
        if (queryTaskRef.current) {
            queryTaskRef.current.abort();
        }
        queryTaskRef.current = new AbortController();
        apiGet(`/addressbooks`, {keywords}, {signal: queryTaskRef.current.signal}).then(response => {
            setNoodleboxItems([...response.data.items]);
        }).catch(reason => {
            console.log(reason.message);
        });
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
            setShowSuggestion(true);
            setItems(
                data.options.map((o: any) => ({
                    address: o.value,
                    link: o.link.href
                })).sort(addressSort)
            )
        }).catch(e => {
            fetchToken();
        });
    }

    const selectAddress = (item: any) => {
        if (item.eircode) {
            setInputValue(item.address);
            setShowSuggestion(false);
            onChange({eircode: item.eircode, address: item.address});
            return false;
        }
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
                            setShowSuggestion(true);
                            setItems(
                                options.map((o: any) => {
                                    return {
                                        address: o.value,
                                        link: o.link.href
                                    }
                                }).sort(addressSort)
                            )
                        }
                    }
                });
        } else {
            onChange?.({
                address: item.address
            });
            setShowSuggestion(false);
        }
    }

    useEffect(() => {
        const onClick = () => {
            setShowSuggestion(false);
        }

        document.addEventListener('click', onClick);
        return () => {
            document.removeEventListener('click', onClick);
        }
    }, []);

    return (
        <div className={'relative'}
             onClick={(e) => {
                 e.nativeEvent.stopPropagation();
             }}
        >
            <Input
                ref={inputRef}
                className={'h-11'}
                value={inputValue}
                autoComplete={'new-password'}
                onChange={(e) => {
                    const address = e.target.value;
                    if (address && address.length > 2) {
                        queryAddress(address);
                        searchAddress(address);
                    } else {
                        setItems([]);
                    }
                    setInputValue(address);
                    onChange({
                        address: address
                    });
                }}
                onFocus={(e) => {
                    e.nativeEvent.stopPropagation();
                    setShowSuggestion(true)
                }}
                onClick={(e) => {
                    e.nativeEvent.stopPropagation();
                }}
            />
            {
                showSuggestion && items.length > 0 && (
                    <div
                        className={'absolute top-full bg-white mt-1 shadow-sm rounded-sm left-0 w-full z-10 overflow-hidden'}>
                        {
                            [...noodleboxItems, ...items].map((item: any) => (
                                <div key={item.address} className={'p-2 text-gray-500 hover:bg-gray-100 cursor-pointer'}
                                     onClick={(e) => {
                                         e.nativeEvent.stopPropagation();
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