export interface Category {
    id: number;
    name: string;
    slug: string;
    thumbnail: string;
    children: Category[];
    products?: Product[];
}

export interface SkuItem {
    id?: number,
    name: string;
    price: number;
    stock: number;
    properties: string;
}

export interface ImageItem {
    src: string;
    alt: string;
}

export interface VariantOptionItem {
    title: string;
    price: number;
    selected: boolean;
}

export interface VariantItem {
    name: string;
    options: VariantOptionItem[]
}

export interface Product {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    thumbnail: string;
    price: number;
    original_price: number;
    status: string;
    icon?: string;
    sold?: number;
    points?: number;
    images?: ImageItem[];
    skus?: SkuItem[];
    categories?: { id: number; name: string }[];
    keywords?: string;
    has_sku_attr?: boolean;
    variants?: VariantItem[];
    additional_options?: VariantOptionItem[],
    variation_list?: VariantItem[];
    meta_data?: Record<string, any>;
    allow_point_purchase?: boolean;
    point_price?: number;
}

export interface CartOptionItem {
    name: string;
    price: number;
    value?: string;
}

export interface CartItem {
    key: string;
    product_id: number;
    title: string;
    thumbnail: string;
    price: number;
    quantity: number;
    sku_id?: number;
    sku_name?: string;
    options?: CartOptionItem[];
    additional_options?: CartOptionItem[];
    purchase_via?: string;
}