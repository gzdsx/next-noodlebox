'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {
    Button,
    Col, ColorPicker,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Switch
} from "antd";
import RichTextEditor from "@/components/common/RichTextEditor";
import {useTranslations} from "@/contexts/BackendLocaleContext";
import {CategoryCheckboxGroup} from "@/components/backend/CategoryCheckboxGroup";
import ImagesInput, {ImageItem} from "@/components/backend/ImagesInput";
import {SkuItem} from "@/components/backend/ProductSkuInput";
import ProductVariantInput from "@/components/backend/ProductVariantInput";
import ProductAdditionalInput from "@/components/backend/ProductAdditionalInput";
import {ProductVariant, ProductVariantOption} from "@/components/backend/ProductVariantModal";
import ProductBageInput from "@/components/backend/ProductBageInput";
interface MetaItem {
    meta_key: string;
    meta_value: string;
}

interface MetasType {
    spicy: string;
    chinese_name: string;
    purchase_via_points_enable: string;
    purchase_via_points: string;
    badges: string[];
    variations: ProductVariant[];
    additional_options: ProductVariantOption[];
    earn_points: number;
}

interface ProductType {
    id?: number;
    title?: string;
    skus: SkuItem[];
    has_sku_attr?: boolean;
    keywords?: string;
    description?: string;
    content?: string;
    thumbnail?: string;
    price?: number;
    regular_price?: number;
    status?: string;
    sort_num?: number;
    categories: number[];
    images: ImageItem[];
    icon?: string;
    sold?: number;
    stock?: number;
    points?: number;
    metas: MetaItem[];
    variation_list: ProductVariant[];
    additional_options: ProductVariantOption[];
}

interface ProductFormProps {
    onSubmit?: (values: {
        id?: number;
        title?: string;
        skus: SkuItem[];
        has_sku_attr?: boolean;
        keywords?: string;
        description?: string;
        content?: string;
        thumbnail?: string;
        price?: number;
        regular_price?: number;
        status?: string;
        sort_num?: number;
        categories: number[];
        images: ImageItem[];
        icon?: string;
        sold?: number;
        stock?: number;
        points?: number;
        metas: MetasType
    }) => Promise<void>;
    initialValues?: ProductType;
    submitting?: boolean;
}

export type {ProductType, MetasType, ProductFormProps};

export const ProductForm = ({
                                initialValues = {
                                    skus: [],
                                    categories: [],
                                    images: [],
                                    metas: [],
                                    variation_list: [],
                                    additional_options: []
                                },
                                submitting = false,
                                onSubmit,
                            }: ProductFormProps) => {
    const [form] = Form.useForm();
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('products');
    const router = useRouter();
    const [metas, setMetas] = useState<MetasType>({
        spicy: '',
        chinese_name: '',
        purchase_via_points_enable: 'no',
        purchase_via_points: '0',
        badges: [],
        variations: [],
        additional_options: [],
        earn_points: 0,
    });

    // Intercept form submit to include skus & model_type
    const handleFinish = (values: ProductType) => {
        //console.log('values', values);
        const submitData = {
            ...values,
            metas: metas
        };
        onSubmit?.(submitData);
    };

    useEffect(() => {
        (function () {
            setMetas(p => ((initialValues.metas || []).reduce((acc, cur) => {
                return {
                    ...acc,
                    [cur.meta_key]: cur.meta_value
                };
            }, p)));
        })()
    }, [initialValues]);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
            initialValues={initialValues}
        >
            <Row gutter={24}>
                {/* 左栏 */}
                <Col xs={24} lg={18}>
                    <Form.Item
                        label={t('productImages')}
                        name="images"
                    >
                        <ImagesInput maxCount={5}/>
                    </Form.Item>

                    <Form.Item
                        label={t('title')}
                        name="title"
                        rules={[{required: true, message: t('titleRequired')}]}
                    >
                        <Input placeholder={t('titlePlaceholder')}/>
                    </Form.Item>

                    <Form.Item label={t('chineseName')}>
                        <Input
                            value={metas.chinese_name}
                            onChange={(e) => setMetas({...metas, chinese_name: e.target.value})}
                        />
                    </Form.Item>

                    <Form.Item
                        label={t('keywords')}
                        name="keywords"
                    >
                        <Input placeholder={t('keywordsPlaceholder')}/>
                    </Form.Item>

                    <Form.Item
                        label={t('description')}
                        name="description"
                    >
                        <RichTextEditor placeholder={t('descriptionPlaceholder')} height={120}/>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col>
                            <Form.Item label={t('titleColor')} name={'title_color'}>
                                <ColorPicker/>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item label={t('pointsPurchase')}>
                                <Switch
                                    checked={metas.purchase_via_points_enable === 'yes'}
                                    onChange={(value) => {
                                        setMetas({...metas, purchase_via_points_enable: value ? 'yes' : 'no'})
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item label={t('pointsPrice')}>
                                <Input
                                    style={{width: 200}}
                                    value={metas.purchase_via_points}
                                    onChange={(e) => {
                                        setMetas({...metas, purchase_via_points: e.target.value})
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item label={t('badge')}>
                                <ProductBageInput badges={metas.badges || []} onChange={(value) => {
                                    setMetas({...metas, badges: value})
                                }}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label={t('fixedPrice')} name={'price'}>
                                <Input style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={t('originalPrice')} name={'regular_price'}>
                                <Input style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={t('stock')} name={'stock'}>
                                <Input style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* 型号选择 */}
                    <Form.Item label={t('variantsAndPrice')}>
                        <ProductVariantInput
                            initalValues={initialValues.variation_list}
                            onChange={variants => {
                                //console.log('variants', variants);
                                setMetas({...metas, variations: variants})
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={t('additionalOptions')}>
                        <ProductAdditionalInput
                            initialValues={initialValues.additional_options}
                            onChange={options => {
                                setMetas({...metas, additional_options: options})
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={t('content')}
                        name="content"
                    >
                        <RichTextEditor placeholder={t('contentPlaceholder')}/>
                    </Form.Item>
                </Col>

                {/* 右栏 */}
                <Col xs={24} lg={6}>
                    <Form.Item
                        label={t('category')}
                        name="categories"
                    >
                        <CategoryCheckboxGroup taxonomy="product"/>
                    </Form.Item>
                    <Form.Item
                        label={t('slug')}
                        name="slug"
                    >
                        <Input style={{width: '100%'}} placeholder=""/>
                    </Form.Item>
                    <Form.Item
                        label={t('sales')}
                        name="sold"
                    >
                        <InputNumber min={0} style={{width: '100%'}} placeholder="0"/>
                    </Form.Item>

                    <Form.Item label={t('points')}>
                        <InputNumber
                            value={metas.earn_points} min={0}
                            style={{width: '100%'}}
                            placeholder="0"
                            onChange={(value) => {
                                setMetas({...metas, earn_points: value || 0})
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={t('badge')}
                        name="icon"
                    >
                        <Select allowClear placeholder={t('badgePlaceholder')}
                                options={[
                                    {value: 'hot', label: t('hot')},
                                    {value: 'new', label: t('new')},
                                ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label={t('status')}
                        name="status"
                        rules={[{required: true}]}
                    >
                        <Select
                            options={[
                                {value: 'onsale', label: t('active')},
                                {value: 'offsale', label: t('inactive')},
                                {value: 'soldout', label: t('soldout')},
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label={t('sortOrder')}
                        name="sort_num"
                    >
                        <Input type="number" placeholder="0"/>
                    </Form.Item>
                    <Form.Item label={t('spiciness')}>
                        <Select
                            value={metas.spicy}
                            options={[
                                {value: 'none', label: t('spicinessNone')},
                                {value: 'slightly', label: t('spicinessSlightly')},
                                {value: 'medium', label: t('spicinessMedium')},
                                {value: 'super', label: t('spicinessSuper')},
                            ]}
                            onChange={(value) => {
                                setMetas({...metas, spicy: value})
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <Form.Item style={{marginTop: 24}}>
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            {tc('save')}
                        </Button>
                        <Button
                            style={{marginLeft: 12}}
                            onClick={() => router.back()}
                        >
                            {tc('cancel')}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};
