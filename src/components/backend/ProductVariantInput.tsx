import {Button, Card, ColorPicker, Input, Radio, Space} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {useSortable} from "@dnd-kit/react/sortable";
import {DeleteOutlined, HolderOutlined, PlusOutlined} from "@ant-design/icons";
import SortableProvider from "@/components/common/SortableProvider";
import {arrayMove} from "@dnd-kit/sortable";
import ProductVariantModal, {ProductVariant, ProductVariantOption} from "@/components/backend/ProductVariantModal";

function SortableCard({id, index, children, title, extra}: {
    id: string,
    index: number,
    children: React.ReactNode,
    title?: React.ReactNode,
    extra?: React.ReactNode
}) {
    const handleRef = React.useRef<HTMLDivElement>(null);
    const {ref} = useSortable({
        id,
        index,
        handle: handleRef,
        transition: {duration: 250, easing: 'ease'},
    });

    return (
        <Card
            ref={ref}
            title={
                <Space>
                    <HolderOutlined ref={handleRef}/>
                    {title}
                </Space>
            }
            extra={extra}
            type={'inner'}
            style={{marginBottom: 16}}
        >{children}</Card>
    );
}

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

const ProductVariantInput = ({initalValues = [], onChange}: {
    initalValues?: ProductVariant[],
    onChange: (variants: ProductVariant[]) => void
}) => {
    const [variants, setVariants] = useState<ProductVariant[]>(initalValues);
    const [modalVisible, setModalVisible] = useState(false);
    const currentVariantIndexRef = useRef<number>(-1);

    const handleAddVariant = () => {
        setVariants([...variants, {name: 'New Variant', options: []}]);
    }

    const handleSortEnd = (oldIndex: number, newIndex: number) => {
        setVariants(prevState => arrayMove(prevState, oldIndex, newIndex));
    };

    useEffect(() => {
        onChange?.(variants);
    }, [variants])

    return (
        <>
            <Card>
                <SortableProvider key={'variants'} onSortEnd={handleSortEnd}>
                    {
                        variants.map((variant, index) => (
                            <SortableCard
                                key={variant.name + '_' + index}
                                id={variant.name + '_' + index}
                                index={index}
                                title={
                                    <>
                                        <strong>型号分类:</strong>
                                        <Input
                                            placeholder="新建型号分类"
                                            className="w-40!"
                                            value={variant.name}
                                            onChange={e => {
                                                setVariants(prev => prev.map((v, i) => i === index ? {
                                                    ...v,
                                                    name: e.target.value
                                                } : v));
                                            }}
                                            onClear={() => {
                                                setVariants(prev => prev.map((v, i) => i === index ? {
                                                    ...v,
                                                    name: ''
                                                } : v));
                                            }}
                                            allowClear={true}
                                        />
                                        <Button
                                            type={"link"}
                                            size={'small'}
                                            onClick={() => {
                                                currentVariantIndexRef.current = index;
                                                setModalVisible(true);
                                            }}>选择常用型号</Button>
                                    </>
                                }
                                extra={<Button type="link"
                                               onClick={() => {
                                                   setVariants(prev => prev.filter((v, i) => i !== index));
                                               }}>移除</Button>}
                            >
                                <SortableProvider
                                    key={`${variant.name + index}_options`}
                                    onSortEnd={(oldIndex, newIndex) => {
                                        setVariants(prev => prev.map((v, i) => i === index ? {
                                            ...v,
                                            options: arrayMove(v.options, oldIndex, newIndex)
                                        } : v));
                                    }}
                                >
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                                            <div style={{width: 10}}></div>
                                            <div style={{width: 300}}>名称</div>
                                            <div style={{width: 100}}>价格</div>
                                            <div style={{width: 35}}>颜色</div>
                                            <div>默认</div>
                                        </div>
                                        {
                                            variant.options.map((option, idx) => (
                                                <SortableOption
                                                    key={variant.name + '_' + index + '_' + idx}
                                                    id={variant.name + '_' + index + '_' + idx}
                                                    index={idx}
                                                    onDelete={() => {
                                                        setVariants(prev => prev.map((v, i) => i === index ? {
                                                            ...v,
                                                            options: v.options.filter((o, i) => i !== idx)
                                                        } : v));
                                                    }}
                                                >
                                                    <Input
                                                        value={option.title}
                                                        style={{width: 300}}
                                                        onChange={e => {
                                                            setVariants(prev => prev.map((v, i) => i === index ? {
                                                                ...v,
                                                                options: v.options.map((o, i) => i === idx ? {
                                                                    ...o,
                                                                    title: e.target.value
                                                                } : o)
                                                            } : v));
                                                        }}
                                                    />
                                                    <Input
                                                        value={option.price}
                                                        style={{width: 100}}
                                                        onChange={e => {
                                                            setVariants(prev => prev.map((v, i) => i === index ? {
                                                                ...v,
                                                                options: v.options.map((o, i) => i === idx ? {
                                                                    ...o,
                                                                    price: e.target.value
                                                                } : o)
                                                            } : v));
                                                        }}
                                                    />
                                                    <ColorPicker
                                                        value={option.color}
                                                        onChange={val => {
                                                            setVariants(prev => prev.map((v, i) => i === index ? {
                                                                ...v,
                                                                options: v.options.map((o, i) => i === idx ? {
                                                                    ...o,
                                                                    color: val.toHexString()
                                                                } : o)
                                                            } : v));
                                                        }}
                                                    />
                                                    <Radio
                                                        checked={option.selected}
                                                        onChange={e => {
                                                            setVariants(prev => prev.map((v, i) => i === index ? {
                                                                ...v,
                                                                options: v.options.map((o, i) => ({
                                                                    ...o,
                                                                    selected: i === idx ? e.target.checked : false
                                                                }))
                                                            } : v));
                                                        }}
                                                    />
                                                </SortableOption>
                                            ))
                                        }
                                    </div>
                                </SortableProvider>
                                <div>
                                    <Button
                                        type="dashed"
                                        size={'middle'}
                                        icon={<PlusOutlined/>}
                                        onClick={() => {
                                            setVariants(prev => prev.map((v, i) => i === index ? {
                                                ...v,
                                                options: [...v.options, {
                                                    title: 'New Option',
                                                    price: '',
                                                    memo: '',
                                                    color: '',
                                                    selected: false
                                                }]
                                            } : v));
                                        }}>
                                        添加型号
                                    </Button>
                                </div>
                            </SortableCard>
                        ))
                    }
                </SortableProvider>
                <Button icon={<PlusOutlined/>} onClick={handleAddVariant}>
                    添加型号分类
                </Button>
            </Card>
            <ProductVariantModal
                open={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelect={(variant) => {
                    const currentVariant = {...variants[currentVariantIndexRef.current]};
                    if (currentVariant.name == '' || currentVariant.name == 'New Variant') {
                        currentVariant.name = variant.name;
                    }
                    const optionTitles = currentVariant.options.map(o => o.title);
                    variant.options.forEach(o => {
                        if (!optionTitles.includes(o.title)) {
                            const {title, price, memo, color} = o;
                            currentVariant.options.push({title, price, memo, color, selected: false});
                        }
                    });

                    setVariants(prev => prev.map((v, i) => i === currentVariantIndexRef.current ? currentVariant : v));
                    setModalVisible(false);
                }}
            />
        </>
    );
};

export default ProductVariantInput;