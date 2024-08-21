import React, { useState, useEffect } from 'react';

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
    register: any;
    errors: any;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    onImageUpload,
    register,
    errors,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        console.log('Selected file:', file); // Debugging log
        if (file) {
            setSelectedFile(file);
            onImageUpload(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            console.log('Preview URL set:', objectUrl); // Debugging log
        }
    };

    useEffect(() => {
        // Cleanup the URL object when the component unmounts or when the file changes
        return () => {
            if (previewUrl) {
                console.log('Revoking URL:', previewUrl); // Debugging log
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div>
            <div>
                <label className="mb-3 block text-black dark:text-white">
                    Foto Kebun
                </label>
                <input
                    {...register('image')}
                    type="file"
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary mb-6"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {errors.image && (
                    <div className="text-red-500">
                        {errors.image?.message?.toString()}
                    </div>
                )}
            </div>
            {previewUrl && (
                <div className="mb-6">
                    <p>Foto Lahan</p>
                    <img src={previewUrl} alt="Uploaded" className="max-h-50" />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
