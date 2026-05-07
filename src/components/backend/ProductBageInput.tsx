import SortableProvider from "@/components/common/SortableProvider";
import {useSortable} from "@dnd-kit/react/sortable";
import React, {useEffect, useState} from "react";
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";
import ModalBadge from "@/components/backend/ModalBadge";
import {arrayMove} from "@dnd-kit/sortable";

const SortableBage = ({id, index, children, className}: {
    id: string,
    index: number,
    children: React.ReactNode,
    className?: string
}) => {
    const {ref} = useSortable({
        id,
        index,
        transition: {duration: 250, easing: 'ease'},
    });
    return (
        <div ref={ref} className={className} style={{width: 40, height: 40, position: 'relative'}}>
            {children}
        </div>
    );
}

const ProductBageInput = ({onChange, initialValues = []}: {
    initialValues: string[],
    onChange: (values: string[]) => void
}) => {
    const [badges, setBadges] = useState(initialValues);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        onChange?.(badges);
    }, [badges]);

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                <SortableProvider onSortEnd={(oldIndex, newIndex) => {
                    setBadges(prev => arrayMove(prev, oldIndex, newIndex));
                }}>
                    {
                        badges.map((badge, index) => (
                            <SortableBage key={`badge-${index}`} id={`badge-${index}`} index={index}
                                          className="badge-item">
                                <img src={badge} style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
                                <div className={'delete-icon'} style={{
                                    position: 'absolute',
                                    top: -10,
                                    right: 0,
                                    zIndex: 10,
                                    cursor: 'pointer',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                    background: 'rgba(0,0,0,0.6)',
                                    width: 20,
                                    height: 20,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff'
                                }}>
                                    <CloseOutlined color={'#fff'} size={20} onClick={() => {
                                        setBadges(prev => prev.filter((_, i) => i !== index));
                                    }}/>
                                </div>
                            </SortableBage>
                        ))
                    }
                    <div
                        onClick={() => setIsDialogOpen(true)}
                        style={{
                            width: 40, height: 40,
                            border: '1px dashed #d9d9d9', borderRadius: 4,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', background: '#fafafa',
                            transition: 'all 0.3s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#1890ff';
                            e.currentTarget.style.background = '#f0f9ff';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#d9d9d9';
                            e.currentTarget.style.background = '#fafafa';
                        }}
                    >
                        <PlusOutlined style={{fontSize: 20, color: '#d9d9d9'}}/>
                    </div>
                </SortableProvider>
            </div>
            <ModalBadge
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={(newBagdes) => {
                    setBadges(prev => [...prev, ...newBagdes.map((b) => b.icon)]);
                    setIsDialogOpen(false);
                }}
            />
            <style>
                {`
                    .badge-item:hover .delete-icon {
                        opacity: 1 !important;
                    }
                `}
            </style>
        </>
    );
};

export default ProductBageInput;