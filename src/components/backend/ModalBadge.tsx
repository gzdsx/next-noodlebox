'use client';

import {Modal} from "antd";
import BadgeClient, {BadgeType} from "@/components/backend/BadgeClient";
import {useState} from "react";

const ModalBadge = ({isOpen, onClose, onConfirm}: {
    isOpen?: boolean,
    onClose?: () => void,
    onConfirm?: (bagdes: BadgeType[]) => void
}) => {
    const [badges, setBadges] = useState<BadgeType[]>([]);
    if (!isOpen) return null;
    return (
        <Modal
            title={"选择Badge"}
            open={true}
            width={850}
            onCancel={() => onClose?.()}
            onOk={() => {
                onConfirm?.(badges);
                onClose?.();
            }}
        >
            <BadgeClient onSelect={setBadges}/>
        </Modal>
    );
};

export default ModalBadge;