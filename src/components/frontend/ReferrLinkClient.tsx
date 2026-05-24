'use client';

import React from "react";
import {toast} from 'sonner';
import {ButtonGroup} from "@/components/ui/button-group";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

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
        <>
            <ButtonGroup className={'w-full mt-4'}>
                <Input value={link} readOnly={true}/>
                <Button type={'button'} onClick={copyLink}>COPY</Button>
            </ButtonGroup>
        </>
    );
};

export default ReferrLinkClient;