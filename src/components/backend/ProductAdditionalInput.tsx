import SortableProvider from "@/components/common/SortableProvider";
import React, {useEffect, useState} from "react";
import {useSortable} from "@dnd-kit/react/sortable";
import {DeleteOutlined, HolderOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, ColorPicker, Input} from "antd";
import ProductVariantModal, {ProductVariantOption} from "@/components/backend/ProductVariantModal";

const SortableOption = ({id, index, children, onDelete}: {
    id: string,
    index: number,
    children: React.ReactNode,
    onDelete: () => void
}) => {
    const handleRef = React.useRef<HTMLDivElement>(null);
    const {ref} = useSortable({
        id,
        index,
        transition: {duration: 250, easing: 'ease'},
        handle: handleRef,
    });
    return (
        <div ref={ref} style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <HolderOutlined ref={handleRef}/>
            {children}
            <Button type="link" color={'danger'} icon={<DeleteOutlined/>} onClick={onDelete}>移除</Button>
        </div>
    );
}

const ProductAdditionalInput = ({initialValues = [], onChange}: {
    initialValues: ProductVariantOption[],
    onChange: (options: ProductVariantOption[]) => void
}) => {
    const [options, setOptions] = useState<ProductVariantOption[]>(initialValues);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        onChange?.(options);
    }, [options]);

    return (
        <>
            <SortableProvider>
                <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16}}>
                    {
                        options.length ? (
                            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                                <div style={{width: 12}}></div>
                                <div style={{width: 300}}>名称</div>
                                <div style={{width: 100}}>价格</div>
                                <div style={{width: 35}}>颜色</div>
                                <div></div>
                            </div>
                        ) : null
                    }
                    {
                        options.map((option, index) => (
                            <SortableOption
                                key={`${option.title}_${index}`}
                                id={`${option.title}_${index}`}
                                index={index}
                                onDelete={() => {
                                    setOptions(prevState => prevState.filter((_, i) => i !== index));
                                }}
                            >
                                <Input
                                    value={option.title}
                                    style={{width: 300}}
                                    onChange={e => {
                                        setOptions(prevState => prevState.map((opt, i) => i === index ? {
                                            ...opt,
                                            title: e.target.value
                                        } : opt));
                                    }}
                                />
                                <Input
                                    value={option.price}
                                    style={{width: 100}}
                                    onChange={e => {
                                        setOptions(prevState => prevState.map((opt, i) => i === index ? {
                                            ...opt,
                                            price: e.target.value
                                        } : opt));
                                    }}
                                />
                                <ColorPicker
                                    value={option.color}
                                    onChange={val => {
                                        setOptions(prevState => prevState.map((opt, i) => i === index ? {
                                            ...opt,
                                            color: val.toHexString()
                                        } : opt));
                                    }}
                                />
                            </SortableOption>
                        ))
                    }
                </div>
                <div style={{display: 'flex'}}>
                    <Button
                        type="dashed"
                        size={'middle'}
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            setOptions(prevState => ([...prevState, {
                                title: 'New Option',
                                price: '',
                                memo: '',
                                color: ''
                            }]));
                        }}>
                        添加型号
                    </Button>
                    <Button
                        type={'link'}
                        size={'middle'}
                        onClick={() => setModalVisible(true)}
                    >选择常用选项</Button>
                </div>
            </SortableProvider>
            <ProductVariantModal
                open={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelect={(variant) => {
                    const newOptions = [...options];
                    const titles = newOptions.map(item => item.title);
                    variant.options.forEach(option => {
                        if (!titles.includes(option.title)) {
                            const {title, price, memo, color} = option;
                            newOptions.push({title, price, memo, color});
                        }
                    });
                    setOptions(newOptions);
                    setModalVisible(false);
                }}
            />
        </>
    );
};

export default ProductAdditionalInput;