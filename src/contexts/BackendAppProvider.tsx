'use client';

import React, {createContext, useContext, useState, useCallback} from 'react';
import {createPortal} from 'react-dom';
import MediaLibrary, {MediaType} from "@/components/backend/MediaLibrary";

interface MediaLibraryOptions {
    multiple?: boolean;
    onSelect?: (medias: MediaType[]) => void;
}

interface BackendAppContextType {
    mediaLibrary: {
        open: (options?: MediaLibraryOptions) => void;
        close: () => void;
    }
}

const BackendAppContext = createContext<BackendAppContextType | undefined>(undefined);

export function BackendAppProvider({children}: { children: React.ReactNode }) {
    const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [mediaLibraryOptions, setMediaLibraryOptions] = useState<MediaLibraryOptions | null | undefined>(null);

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
        }
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
