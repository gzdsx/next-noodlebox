export interface Category {
    id: number;
    name: string;
    slug: string;
    thumbnail: string;
    children: Category[];
    products?: Product[];
}

export interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    icon?: string;
    sold?: number;
    meta_data?: Record<string, any>;
}