import {redirect} from "next/navigation";
import {type NextRequest} from 'next/server'
import {apiPost} from "@/lib/api";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const token = searchParams.get('token');
        await apiPost(`/orders/${token}/capture-paypal-order`);
    } catch (e) {

    } finally {
        redirect('/user/orders');
    }
}