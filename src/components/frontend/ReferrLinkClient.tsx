'use client';

import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Button} from "@/components/ui/button";
import React from "react";
import {toast} from 'sonner';

const ReferrLinkClient = ({link}: { link: string }) => {
    const copyLink = () => {
        if (!navigator?.clipboard) {
            console.warn('当前浏览器不支持 Clipboard API');
            return false;
        }

        navigator.clipboard
            .writeText(link)
            .then(() => {
                toast.success('Link copied successfully');
            })
            .catch((err) => {
                console.error('复制失败:', err);
            });
    }
    return (
        <InputGroup className={'px-0 w-full mt-4'}>
            <InputGroupInput
                placeholder=""
                value={link}
                readOnly={true}
            />
            <InputGroupAddon align={'inline-end'}>
                <Button
                    type={'button'}
                    className={'-mr-1.5 rounded-l-none cursor-pointer'}
                    onClick={copyLink}
                >COPY</Button>
            </InputGroupAddon>
        </InputGroup>
    );
};

export default ReferrLinkClient;