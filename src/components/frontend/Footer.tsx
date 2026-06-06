'use client';

import React from 'react';
import {Mail, Phone, Facebook, Instagram, Youtube} from 'lucide-react';
import "@/lib/arms";

export default function Footer() {
    return (
        <footer className="text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* App Download Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
                    <a
                        href="https://apps.apple.com/en/app/id6630383406?l=zh&ls=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors min-w-[200px]"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                        </svg>
                        <span className="text-base">App for iOS</span>
                    </a>
                    <a
                        href="https://play.google.com/store/apps/details?id=ie.noodlebox.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors min-w-[200px]"
                    >
                        <svg viewBox="0 0 1024 1024" width="18" height="18">
                            <path d="M229.443715 343.118259l565.172804 0 0 410.010794c0 37.525595-30.237317 67.762912-67.040108 67.762912l-46.319715 0 0 139.742183c0 35.116247-28.249605 63.365852-63.305618 63.365852-35.116247 0-63.546553-28.309839-63.546553-63.365852l0-139.742183-84.809049 0 0 139.742183c0 35.056013-28.430306 63.365852-63.546553 63.365852-34.393443 0-62.763515-28.309839-62.763515-63.365852l-0.542103-139.742183-45.596911 0c-37.465361 0-67.702678-30.177084-67.702678-67.762912l0-410.010794zM141.984383 331.432921c-35.056013 0-63.426086 28.370073-63.426086 62.763515l0 264.787344c0 35.116247 28.370073 63.365852 63.426086 63.365852s62.763515-28.309839 62.763515-63.365852l0-264.787344c0-34.393443-28.189371-62.763515-62.763515-62.763515zM796.42353 320.952257l-569.449397 0c0-97.879762 58.547156-182.869512 145.343917-227.141282l-43.7899-80.59269c-2.469582-4.336826-1.264908-9.878327 3.071919-12.347908 4.276593-1.867245 9.878327-0.662571 12.347908 3.734489l44.271769 81.255261c37.646062-16.684735 79.508484-25.900491 123.780253-25.900491s86.134191 9.215756 123.780253 25.840257l44.271769-81.255261c2.469582-4.336826 8.071316-5.5415 12.347908-3.734489 4.336826 2.469582 5.5415 8.011082 3.071919 12.347908l-43.7899 80.59269c86.254658 44.332003 144.74158 129.321753 144.74158 227.201515zM406.048922 194.160319c0-12.950245-10.42043-24.033246-23.912779-24.033246-13.010479 0-23.430909 11.083001-23.430909 24.033246 0 12.890012 10.42043 23.973012 23.430909 23.973012 13.492349 0.060234 23.912779-11.022767 23.912779-23.973012zM665.294766 194.160319c0-12.950245-10.42043-24.033246-23.430909-24.033246-13.552582 0-23.912779 11.083001-23.912779 24.033246 0 12.890012 10.42043 23.973012 23.912779 23.973012 13.010479 0.060234 23.430909-11.022767 23.430909-23.973012zM882.015617 331.432921c-34.51391 0-62.763515 27.707502-62.763515 62.763515l0 264.787344c0 35.116247 28.249605 63.365852 62.763515 63.365852 35.056013 0 63.426086-28.309839 63.426086-63.365852l0-264.787344c-0.060234-35.056013-28.370073-62.763515-63.426086-62.763515z" fill="#ffffff" p-id="5191"></path>
                        </svg>

                        <span className="text-base">App for Android</span>
                    </a>
                </div>

                {/* Providers Image */}
                <div className="flex justify-center mb-8">
                    <img
                        src="/gys-111-600x76.avif"
                        alt="Our Providers"
                        className="max-w-full h-10"
                    />
                </div>

                {/* Social Icons & Copyright */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-4">
                        <a href="mailto:info@thenoodlebox.ie"
                           className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center transition-colors">
                            <Mail size={18}/>
                        </a>
                        <a href="https://www.facebook.com/noodlebox.dao" target="_blank"
                           rel="noopener noreferrer"
                           className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center transition-colors">
                            <Facebook size={18}/>
                        </a>
                        <a href="https://www.instagram.com/noodlebox_drogheda/" target="_blank"
                           rel="noopener noreferrer"
                           className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center transition-colors">
                            <Instagram size={18}/>
                        </a>
                        <a href="tel:0419845775"
                           className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center transition-colors">
                            <Phone size={18}/>
                        </a>
                        <a href="https://www.youtube.com/channel/UC5lWEK3xzjWtK0DPerbI_kw?view_as=subscriber"
                           target="_blank" rel="noopener noreferrer"
                           className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center transition-colors">
                            <Youtube size={18}/>
                        </a>
                    </div>
                    <div className="text-sm text-gray-300">
                        &copy;{new Date().getFullYear()} noodlebox.ie. All right reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
