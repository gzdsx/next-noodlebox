import PointsClient from "@/components/frontend/PointsClient";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Points - The Best Chinese Takeaway In Drogheda',
}

export default function Page() {
    return <PointsClient/>;
}