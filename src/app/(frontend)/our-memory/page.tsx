import {apiGet} from "@/lib/api";
import PageClient from "./PageClient";
import "yet-another-react-lightbox/styles.css";

const getImages = async (page: number) => {
    try {
        const response = await apiGet(`/shops/1/images`, {
            offset: (page - 1) * 30,
            limit: 30
        });
        return response.data;
    } catch (e) {
        console.log('获取店铺图片失败:', e);
        return {total: 0, items: []};
    }
}

export default async function Page({searchParams}: { searchParams: Promise<any> }) {
    const {page} = await searchParams;
    const {items: images, total} = await getImages(page);
    return (
        <PageClient images={images} total={total} page={page}/>
    )
}