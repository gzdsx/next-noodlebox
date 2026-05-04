'use client';

import React, {createContext, useContext, useState, useCallback, useEffect} from 'react';
import {createPortal} from 'react-dom';
import MediaLibrary, {MediaType} from "@/components/backend/MediaLibrary";
import {App} from "antd";

interface MediaLibraryOptions {
    multiple?: boolean;
    onSelect?: (medias: MediaType[]) => void;
}

interface AdminUser {
    id: number;
    name: string;
    email: string;
    avatar: string;
    role: string;
}

interface BackendAppContextType {
    mediaLibrary: {
        open: (options?: MediaLibraryOptions) => void;
        close: () => void;
    },
    administrator: AdminUser | null;
}

const BackendAppContext = createContext<BackendAppContextType | undefined>(undefined);

export function BackendAppProvider({children}: { children: React.ReactNode }) {
    const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [mediaLibraryOptions, setMediaLibraryOptions] = useState<MediaLibraryOptions | null | undefined>(null);
    const [administrator, setAdministrator] = useState<AdminUser | null>(null);

    useEffect(() => {
        (function () {
            try {
                const data = localStorage.getItem('adminUser');
                if (data) {
                    setAdministrator(JSON.parse(data));
                }
            } catch (e) {
                console.log(e);
            }
        })()
    }, []);

    const openMediaLibrary = useCallback((options?: MediaLibraryOptions) => {
        setMediaLibraryOpen(true);
        setMediaLibraryOptions(options);
    }, []);

    const closeMediaLibrary = useCallback(() => {
        setMediaLibraryOpen(false);
    }, []);

    const contextValue: BackendAppContextType = {
        mediaLibrary: {
            open: openMediaLibrary,
            close: closeMediaLibrary,
        },
        administrator
    };

    return (
        <BackendAppContext.Provider value={contextValue}>
            {children}
            {typeof document !== 'undefined' && (
                <>
                    {
                        mediaLibraryOpen && createPortal(
                            <MediaLibrary
                                {...mediaLibraryOptions}
                                open={true}
                                onClose={closeMediaLibrary}
                            />
                            ,
                            document.body
                        )
                    }
                </>
            )}

        </BackendAppContext.Provider>
    )
}

export function useBackendApp() {
    const context = useContext(BackendAppContext);
    if (!context) {
        throw new Error('useBackendApp must be used inside BackendAppProvider');
    }
    return context;
}


export function useMediaLibrary() {
    const {mediaLibrary} = useBackendApp();
    return mediaLibrary;
}

export function useAdministrator() {
    const {administrator} = useBackendApp();
    return administrator;
}

export function useMessage() {
    const {message} = App.useApp();
    return message;
}