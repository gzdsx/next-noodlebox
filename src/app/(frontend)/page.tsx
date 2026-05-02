import HeroBanner from '@/components/frontend/HeroBanner';
import MapSection from '@/components/frontend/MapSection';

export default async function HomePage() {
    return (
        <div>
            <HeroBanner/>
            <MapSection/>
        </div>
    );
}
