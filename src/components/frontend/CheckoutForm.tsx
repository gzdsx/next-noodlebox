'use client';

import React, {useEffect, useState} from 'react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Spinner} from '@/components/ui/spinner';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {useTranslations} from '@/contexts/LocaleContext';
import {useCart} from '@/contexts/CartContext';
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {apiPost} from "@/lib/api";
import {PayPalButtons} from "@paypal/react-paypal-js";
import {toast} from "sonner";
import DialogVerifyPhoneNumber from "@/components/frontend/DialogVerifyPhoneNumber";
import {ShippingAddress, ShippingZone} from "@/types";
import {useCurrentUser} from "@/contexts/AppContext";
import AutoAddressInput from "@/components/frontend/AutoAddressInput";

interface CheckoutFormProps {
    options?: any;
    onChange?: (values: any) => void;
    onPlaced?: (orderId: number) => void;
}

export default function CheckoutForm({options, onChange, onPlaced}: CheckoutFormProps) {
    const {totalPrice, reloadCart} = useCart();
    const currentUser = useCurrentUser();
    const {t} = useTranslations('ecommerce');
    const [shipping, setShipping] = useState<ShippingAddress>({
        name: '',
        iddcode: '',
        phone_number: '',
        address: '',
        eircode: ''
    });
    const [shippingMethod, setShippingMethod] = useState('flat_rate');
    const [shippingZoneId, setShippingZoneId] = useState<string | number | undefined>(options?.shipping_zone_id);
    const [paymentMethod, setPaymentMethod] = useState('paypal');
    const [notes, setNotes] = useState('');
    const [pointsValue, setPointsValue] = useState('0');
    const [usePointsValue, setUsePointsValue] = useState('0');
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [orderId, setOrderId] = useState<number>(0);

    const loadData = async () => {
        try {
            const response = await apiPost('/checkout/calculate', {
                shipping_method: shippingMethod,
                shipping_zone_id: shippingZoneId,
                payment_method: paymentMethod,
                notes: notes,
                use_points_value: usePointsValue,
            });
            onChange?.({...response.data});
        } catch (e: unknown) {
            console.error(e);
        }
    }

    const handleCrateOrder = async () => {
        try {
            setSubmitting(true);
            let response = await apiPost('/my/phones/check', {
                iddcode: shipping.iddcode,
                phone_number: shipping.phone_number,
            });

            if (response.data !== true) {
                setIsVerifyOpen(true);
                return;
            }

            response = await apiPost('/orders', {
                shipping_method: shippingMethod,
                shipping_zone_id: shippingZoneId,
                payment_method: paymentMethod,
                use_points_value: usePointsValue,
                buyer_note: notes,
                shipping,
            });

            const {order_id, payment_method} = response.data;
            setOrderId(order_id);
            reloadCart();

            if (payment_method === 'paypal') {
                response = await apiPost(`/orders/${order_id}/create-paypal-order`);
                return response.data.id;
            } else {
                await onPlaced?.(order_id);
            }
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setSubmitting(false);
        }
    }

    const handleApprove = async (data: any) => {
        try {
            await apiPost(`/orders/${data.orderID}/capture-paypal-order`);
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            await onPlaced?.(orderId);
        }
    }

    const handlePapalCancel = () => {
        onPlaced?.(orderId);
    }

    useEffect(() => {
        //console.log(options);
        loadData();
    }, [shippingZoneId, shippingMethod, paymentMethod, usePointsValue]);

    useEffect(() => {
        setShipping(prevState => ({
            ...prevState,
            ...options.shipping_address,
            iddcode: options.shipping_address.iddcode || '353'
        }));
    }, [options.shipping_address]);

    return (
        <>
            <form className="space-y-0">
                {/* Shipping Info */}
                <h3 className="text-lg font-semibold mb-4">{t('checkout.shippingInfo')}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('checkout.name')}</Label>
                        <Input
                            id="name"
                            className="h-11 placeholder:text-white"
                            placeholder={t('checkout.name')}
                            value={shipping.name}
                            onChange={(e) => {
                                setShipping(prev => ({...prev, name: e.target.value}));
                            }}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone_number">{t('checkout.phone')}</Label>
                        <InputGroup className={'h-11'}>
                            <InputGroupInput
                                id="phone_number"
                                className={'placeholder:text-white'}
                                placeholder={t('checkout.phone')}
                                value={shipping.phone_number}
                                onChange={(e) => {
                                    setShipping(prev => ({...prev, phone_number: e.target.value}));
                                }}
                                required
                            />
                            <InputGroupAddon>
                                <Select
                                    value={shipping.iddcode}
                                    onValueChange={(value) => setShipping(prev => ({...prev, iddcode: value}))}>
                                    <SelectTrigger className="w-full max-w-48 border-0 text-white">
                                        <SelectValue placeholder="Select a iddcode"/>
                                    </SelectTrigger>
                                    <SelectContent className={'border-0 placeholder:text-white'}>
                                        <SelectGroup>
                                            <SelectItem value="353">+353</SelectItem>
                                            <SelectItem value="44">+44</SelectItem>
                                            <SelectItem value="86">+86</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </div>

                <h3 className="text-lg font-semibold my-4">Shipping Method</h3>
                <div className="space-y-2">
                    <RadioGroup
                        value={shippingMethod}
                        onValueChange={(value) => setShippingMethod(value)}
                        orientation={'horizontal'}
                        className="flex items-center gap-4"
                        style={{'--primary': '#66beb8'} as React.CSSProperties}
                    >
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="flat_rate" id="flat_rate"/>
                            <Label htmlFor="flat_rate" className="text-sm cursor-pointer">Delivery</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="local_pickup" id="local_pickup"/>
                            <Label htmlFor="local_pickup" className="text-sm cursor-pointer">Collection</Label>
                        </div>
                    </RadioGroup>
                </div>

                {
                    shippingMethod === 'flat_rate' && (
                        <>
                            <div className="space-y-2 mt-4">
                                <Label htmlFor="address">{t('checkout.address')}</Label>
                                <AutoAddressInput
                                    defaultValue={shipping.address}
                                    onChange={(value) => {
                                        //console.log('value:', value);
                                        setShipping(prev => ({...prev, ...value}));

                                        const address = value.address.toLowerCase();
                                        options.shipping_zones.forEach((zone: ShippingZone) => {
                                            if (address.includes(zone.title.toLowerCase())) {
                                                setShippingZoneId(zone.id);
                                            }
                                        });
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">{t('checkout.city')}</Label>
                                    <select
                                        className={'w-full border border-gray-300 rounded-sm shadow-sm h-11 px-2'}
                                        value={shippingZoneId}
                                        onChange={(e) => {
                                            setShippingZoneId(e.target.value);
                                        }}
                                    >
                                        {
                                            options?.shipping_zones?.map((zone: ShippingZone) => (
                                                <option key={zone.title} value={zone.id}>{zone.title}(€{zone.fee})</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="eircode">{'Eircode'}</Label>
                                    <Input
                                        id="eircode"
                                        className="h-11 placeholder:text-white"
                                        placeholder={'Your Eircode'}
                                        value={shipping.eircode}
                                        onChange={(e) => {
                                            setShipping(prev => ({...prev, eircode: e.target.value}));
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )
                }

                <div className="space-y-2 mt-4">
                    <Label htmlFor="address">Notes</Label>
                    <Textarea
                        id="address"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                {/* Payment Method */}
                <h3 className="text-lg font-semibold mt-6 mb-4">{t('checkout.paymentMethod')}</h3>
                <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value)}
                    className="space-y-3"
                    style={{'--primary': '#66beb8'} as React.CSSProperties}
                >
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="paypal" id="paypal"/>
                        <Label htmlFor="paypal"
                               className="text-sm cursor-pointer">{'Pay Online (PayPal & Credit Card)'}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="cash" id="cash"/>
                        <Label htmlFor="cash" className="text-sm cursor-pointer">{`Pay Cash`}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="cod" id="cod"/>
                        <Label htmlFor="cod" className="text-sm cursor-pointer">{`Pay by Card Reader(Unpaid)`}</Label>
                    </div>
                </RadioGroup>

                {
                    options?.enable_points_checkout === 'yes' && (
                        <>
                            <h3 className="text-lg font-semibold mt-6 mb-4 text-[#f19e39]">
                                User Points ({currentUser?.points} points total)
                            </h3>
                            <div className="space-y-2">
                                <InputGroup className={'px-0 w-full max-w-60'}>
                                    <InputGroupInput
                                        placeholder=""
                                        value={pointsValue}
                                        onChange={(e) => setPointsValue(e.target.value)}
                                    />
                                    <InputGroupAddon align={'inline-end'}>
                                        <Button
                                            type={'button'}
                                            className={'-mr-1.5 rounded-l-none cursor-pointer'}
                                            onClick={() => setUsePointsValue(pointsValue)}
                                        >Confirm</Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                        </>
                    )
                }

                {/* Submit */}
                {
                    paymentMethod === 'paypal' ? (
                        <div className="w-full mt-8">
                            <PayPalButtons
                                createOrder={handleCrateOrder}
                                onApprove={handleApprove}
                                onCancel={handlePapalCancel}
                                onError={(error) => {
                                    console.error("Error:", error);
                                    onPlaced?.(orderId);
                                }}
                            />
                        </div>
                    ) : (
                        <Button
                            type="button"
                            size="lg"
                            disabled={submitting}
                            className="w-full h-12 text-base mt-8"
                            onClick={handleCrateOrder}
                        >
                            {submitting ? <Spinner
                                className={'text-white'}/> : `${t('checkout.placeOrder')} · €${totalPrice.toFixed(2)}`}
                        </Button>
                    )
                }

                <div className={'mt-4 text-center text-[#f19e39]'}>
                    I’ve read and accept the <a href={'/terms-conditions'} target={'_blank'}
                                                className={'text-white hover:underline'}>terms &
                    conditions</a> and <a href={'privacy'} target={'_blank'} className={'text-white hover:underline'}>privacy
                    conditions</a>
                </div>
            </form>
            {
                isVerifyOpen && (
                    <DialogVerifyPhoneNumber
                        iddCode={shipping.iddcode}
                        phoneNumber={shipping.phone_number}
                        onClose={() => setIsVerifyOpen(false)}
                        onSuccess={() => setIsVerifyOpen(false)}
                    />
                )
            }
        </>
    );
}
