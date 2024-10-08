import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
interface inputProps {
    register: any;
    errors: any;
}

const SignaturePad: React.FC<inputProps> = ({ register, errors }) => {
    const [url, setUrl] = useState<string>('');
    const signCanvasRef = useRef<SignatureCanvas | null>(null);

    const handleClear = () => {
        signCanvasRef.current?.clear();
        setUrl('');
    };

    const handleGenerate = () => {
        if (signCanvasRef.current) {
            setUrl(
                signCanvasRef.current.getTrimmedCanvas().toDataURL('image/png'),
            );
        }
    };

    return (
        <div>
            <div style={{ border: '2px solid black', width: 500, height: 200 }}>
                <SignatureCanvas
                    {...register('tandaTangan')}
                    canvasProps={{
                        width: 500,
                        height: 200,
                        className: 'sigCanvas',
                    }}
                    ref={signCanvasRef}
                />
                {errors.tandaTangan && (
                    <div className="text-red-500">
                        {errors.tandaTangan.message}
                    </div>
                )}
            </div>

            <br />
            <button
                style={{ height: '30px', width: '60px' }}
                onClick={handleClear}
            >
                Clear
            </button>
            <button
                style={{ height: '30px', width: '60px' }}
                onClick={handleGenerate}
            >
                Save
            </button>

            <br />
            <br />
            {url && <img src={url} alt="Signature" />}
        </div>
    );
};

export default SignaturePad;
