import React, {useEffect, useRef} from 'react';
import SignaturePad from 'signature_pad';

interface SignatureCanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
    onSignatureChange?: (dataUrl: string) => void;
}

const SignatureCanvas = ({onSignatureChange, style, ...reset}: SignatureCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const signaturePadRef = useRef<SignaturePad | null>(null);

    // 2. 处理窗口缩放（Canvas 需要重新计算宽高）
    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            // 清除当前签名并调整大小（注意：缩放会清空画布内容）
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d")?.scale(ratio, ratio);
            signaturePadRef.current?.clear();
        }
    };

    useEffect(() => {
        if (canvasRef.current) {
            // 1. 初始化 SignaturePad
            signaturePadRef.current = new SignaturePad(canvasRef.current, {
                backgroundColor: 'rgb(255, 255, 255)', // 设置背景色，否则导出 PNG 可能是透明的
                penColor: 'rgb(0, 0, 0)'
            });

            signaturePadRef.current.addEventListener('endStroke', (evt) => {
                //console.log('endStroke', evt);
                const dataUrl = signaturePadRef.current?.toDataURL();
                onSignatureChange?.(dataUrl as string);
            });

            window.addEventListener("resize", resizeCanvas);
            resizeCanvas();

            return () => window.removeEventListener("resize", resizeCanvas);
        }
    }, []);

    // useEffect(() => {
    //     resizeCanvas();
    // }, [style, reset.className]);

    const handleClear = () => {
        signaturePadRef.current?.clear();
        onSignatureChange?.('');
    };

    const handleExport = () => {
        if (signaturePadRef.current?.isEmpty()) {
            alert("请先进行签名");
            return;
        }
        const dataUrl = signaturePadRef.current?.toDataURL(); // 导出 Base64
    };

    return (
        <div className="flex flex-col items-center">
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <canvas
                    ref={canvasRef}
                    style={{width: '100%', height: '200px', cursor: 'crosshair', ...style}}
                    {...reset}
                />
            </div>
            <div className="w-full flex flex-row justify-start mt-1">
                <button
                    onClick={handleClear}
                    className="px-4 py-0.5 cursor-pointer border border-gray-200  rounded hover:bg-gray-300"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SignatureCanvas;