import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { getTranslations } from '@/lib/i18n';

interface PageData {
    id: number;
    title: string;
    slug: string;
    content: string;
}

interface PageItem {
    id: number;
    title: string;
    slug: string;
}

async function fetchPage(slug: string): Promise<PageData | null> {
    try {
        const response = await apiGet(`/pages/${slug}`);
        return response.data;
    } catch {
        return null;
    }
}

async function fetchPages(): Promise<PageItem[]> {
    try {
        const response = await apiGet('/pages', {status: 'publish', limit: 100});
        return response.data.items || [];
    } catch {
        return [];
    }
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [page, pages] = await Promise.all([fetchPage(slug), fetchPages()]);
    const { t } = getTranslations('ecommerce');

    if (!page) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <div className={'h-24'}></div>
                <h1 className="text-2xl font-bold  mb-4">{t('page.notFound')}</h1>
                <Link href="/" className="">{t('page.backToHome')}</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 mt-24">
            <nav className="mb-6 text-sm">
                <Link href="/" className="hover:text-gray-300">{t('page.home')}</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-100">{page.title}</span>
            </nav>
            <div className="flex flex-col md:flex-row gap-6">
                <aside className="md:w-52 shrink-0 bg-transparent border border-gray-300 rounded-lg p-4">
                    <ul className="space-y-1">
                        {pages.map((p) => (
                            <li key={p.id}>
                                <Link
                                    href={`/${p.slug}`}
                                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                        p.slug === slug
                                            ? 'bg-[#66beb8]! text-white! font-medium'
                                            : 'text-gray-200 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    {p.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-center mb-6">{page.title}</h1>
                    <article className="prose prose-sm max-w-none leading-8!"
                             dangerouslySetInnerHTML={{ __html: page.content }}/>
                </div>
            </div>
        </div>
    );
}
