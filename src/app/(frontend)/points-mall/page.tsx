import {Suspense} from "react";
import PageClient from "./PageClient";
import {apiGet} from "@/lib/api";

const getCategories = async () => {
    try {
        const response = await apiGet(`/products/points-mall`);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
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