import zhMessages from '@/messages/zh.json';
import enMessages from '@/messages/en.json';

type Locale = 'zh' | 'en';

const messages: Record<Locale, any> = {
    zh: zhMessages,
    en: enMessages,
};

export function getTranslations(namespace?: string, locale: Locale = 'zh') {
    const t = (key: string, params?: Record<string, string | number>): string => {
        const fullKey = namespace ? `${namespace}.${key}` : key;
        const keys = fullKey.split('.');
        let value: any = messages[locale];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return fullKey;
            }
        }

        if (typeof value !== 'string') return fullKey;
        if (!params) return value;
        return value.replace(/\{(\w+)\}/g, (_, name) =>
            params[name] !== undefined ? String(params[name]) : `{${name}}`
        );
    };

    return { t };
}
