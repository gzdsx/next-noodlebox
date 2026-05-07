'use client';

import {useState, useEffect} from 'react';
import {
    App,
    Form,
    Input,
    Switch,
    Button,
    Card,
    Spin,
    Select,
    Image,
} from 'antd';
import {SaveOutlined, GiftOutlined} from '@ant-design/icons';
import {apiGet, apiPost} from "@/lib/backendApi";
import {useTranslations} from "@/contexts/BackendLocaleContext";
import {useMediaLibrary} from "@/contexts/BackendAppContext";

export default function LotterySettingsPage() {
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const mediaLibrary = useMediaLibrary();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [floatIconUrl, setFloatIconUrl] = useState<string>('');
    const {t: tc} = useTranslations('common');
    const {t} = useTranslations('settings');

    useEffect(() => {
        fetchLotteryConfig();
    }, []);

    const fetchLotteryConfig = async () => {
        setLoading(true);
        try {
            const response = await apiGet('/lottery/settings');
            const data = response.data;

            form.setFieldsValue({
                enable: data.enable,
                name: data.name,
                description: data.description,
                price: data.price,
                insufficient_points: data.insufficient_points,
                pick_text: data.pick_text,
                winning_text: data.winning_text,
                not_winning_text: data.not_winning_text,
                points_balance_text: data.points_balance_text,
                float_icon: data.float_icon,
                lottery_type: data.lottery_type,
            });

            if (data.float_icon) {
                setFloatIconUrl(data.float_icon);
            }
        } catch (error) {
            message.error(t('loadLotteryConfigError'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: Record<string, unknown>) => {
        setSaving(true);
        try {
            await apiPost('/lottery/settings', values);
            message.success(tc('saveSuccess'));
        } catch (error) {
            message.error(tc('saveError'));
        } finally {
            setSaving(false);
        }
    };

    const handleSelectFloatIcon = () => {
        mediaLibrary.open({
            multiple: false,
            onSelect: (medias) => {
                const url = medias[0].src || medias[0].url || '';
                setFloatIconUrl(url);
                form.setFieldValue('float_icon', url);
            },
        });
    };

    return (
        <div>
            <Card title={
                <span>
                    <GiftOutlined style={{marginRight: 8, color: '#ff4d4f'}}/>
                    {t('lotterySettings')}
                </span>
            }>
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label={t('lotteryEnable')}
                            name="enable"
                            valuePropName="checked"
                            getValueProps={(value) => ({checked: value === 'yes'})}
                            getValueFromEvent={(checked) => (checked ? 'yes' : 'no')}
                            help={t('lotteryEnableDesc')}
                        >
                            <Switch/>
                        </Form.Item>

                        <Form.Item
                            label={t('lotteryName')}
                            name="name"
                            help={t('lotteryNameTips')}
                        >
                            <Input placeholder={t('lotteryNamePlaceholder')} style={{maxWidth: 400}}/>
                        </Form.Item>

                        <Form.Item
                            label={t('lotteryDescription')}
                            name="description"
                            help={t('lotteryDescriptionTips')}
                        >
                            <Input.TextArea rows={3} placeholder={t('lotteryDescriptionPlaceholder')}/>
                        </Form.Item>

                        <Form.Item
                            label={t('lotteryPrice')}
                            name="price"
                            help={t('lotteryPriceTips')}
                        >
                            <Input placeholder={t('lotteryPricePlaceholder')} style={{maxWidth: 200}}/>
                        </Form.Item>

                        <Form.Item
                            label={t('lotteryInsufficientPoints')}
                            name="insufficient_points"
                            help={t('lotteryInsufficientPointsTips')}
                        >
                            <Input.TextArea rows={2} placeholder={t('lotteryInsufficientPointsPlaceholder')}/>
                        </Form.Item>

                        <Form.Item label={t('lotteryPickText')} name="pick_text">
                            <Input placeholder={t('lotteryPickTextPlaceholder')} style={{maxWidth: 300}}/>
                        </Form.Item>

                        <Form.Item label={t('lotteryWinningText')} name="winning_text">
                            <Input placeholder={t('lotteryWinningTextPlaceholder')} style={{maxWidth: 400}}/>
                        </Form.Item>

                        <Form.Item label={t('lotteryNotWinningText')} name="not_winning_text">
                            <Input placeholder={t('lotteryNotWinningTextPlaceholder')} style={{maxWidth: 400}}/>
                        </Form.Item>

                        <Form.Item label={t('lotteryPointsBalanceText')} name="points_balance_text">
                            <Input placeholder={t('lotteryPointsBalanceTextPlaceholder')} style={{maxWidth: 400}}/>
                        </Form.Item>

                        <Form.Item label={t('lotteryFloatIcon')} name="float_icon">
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 12
                            }}>
                                {floatIconUrl && (
                                    <Image
                                        src={floatIconUrl}
                                        alt="float-icon"
                                        width={60}
                                        height={60}
                                        style={{objectFit: 'contain', borderRadius: 4}}
                                        preview={false}
                                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPk2iUKYQAAAABJRU5ErkJggg=="
                                    />
                                )}
                                <Button onClick={handleSelectFloatIcon}>{t('lotteryFloatIconPlaceholder')}</Button>
                            </div>
                        </Form.Item>

                        <Form.Item label={t('lotteryType')} name="lottery_type">
                            <Select
                                style={{maxWidth: 300}}
                                placeholder={t('lotteryTypePlaceholder')}
                                options={[
                                    {value: 'chest', label: '开宝箱'},
                                ]}
                                allowClear
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined/>} loading={saving}>
                                {tc('save')}
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
}
