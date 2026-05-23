import {Suspense} from "react";
import PageClient from "./PageClient";
import {apiGet} from "@/lib/api";
import {Metadata} from "next";

const getCategories = async () => {
    try {
        const response = await apiGet(`/products/points-mall`);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Points Mall - The Best Chinese Takeaway In Drogheda',
    }
}

export default async function Page() {
    const categories = await getCategories();
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageClient categories={categories}/>
        </Suspense>
    );
}