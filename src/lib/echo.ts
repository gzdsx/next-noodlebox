import { configureEcho } from "@laravel/echo-react";

configureEcho({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    wsHost: 'pusher.noodlebox.ie',
    wssPort: 443,
    forceTLS: true,
    debugger: true,
    logToConsole: true, // 在控制台输出日志
    enabledTransports: ['ws', 'wss']
});