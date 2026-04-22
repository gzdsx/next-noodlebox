'use client';

import React from 'react';
import {Slider, InputNumber, Button} from 'antd';
import {useTranslations} from '@/contexts/LocaleContext';

interface PriceFilterProps {
    min?: number;
    max?: number;
    onChange: (range: [number, number]) => void;
}

export default function PriceFilter({min = 0, max = 10000, onChange}: PriceFilterProps) {
    const {t} = useTranslations('ecommerce');
    const [range, setRange] = React.useState<[number, number]>([min, max]);

    const handleApply = () => {
        onChange(range);
    };

    const handleReset = () => {
        setRange([0, 10000]);
        onChange([0, 10000]);
    };

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">{t('filter.priceRange')}</h4>
            <Slider
                range
                min={0}
                max={10000}
                step={10}
                value={range}
                onChange={(val) => setRange(val as [number, number])}
            />
            <div className="flex items-center gap-2">
                <InputNumber
                    min={0}
                    max={10000}
                    value={range[0]}
                    onChange={(val) => setRange([val ?? 0, range[1]])}
                    className="!w-24"
                    size="small"
                    prefix="¥"
                />
                <span className="text-gray-400">-</span>
                <InputNumber
                    min={0}
                    max={10000}
                    value={range[1]}
                    onChange={(val) => setRange([range[0], val ?? 10000])}
                    className="!w-24"
                    size="small"
                    prefix="¥"
                />
            </div>
            <div className="flex gap-2">
                <Button size="small" type="primary" onClick={handleApply}>{t('filter.apply')}</Button>
                <Button size="small" onClick={handleReset}>{t('filter.reset')}</Button>
            </div>
        </div>
    );
}
