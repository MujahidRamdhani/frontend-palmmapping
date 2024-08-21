import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

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
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);
            onImageUpload(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleDeleteImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);

        // Reset the file input element
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
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
                    {...register('image', {
                        required: 'Foto Kebun Tidak Boleh Kosong',
                    })}
                    type="file"
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary mb-2"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {errors.image && (
                    <div className="text-red-500 mb-2">
                        {errors.image.message}
                    </div>
                )}
            </div>
            {previewUrl && (
                <div className="mb-6">
                    <p>Foto Lahan</p>
                    <div className="flex gap-2 items-center">
                        <img
                            src={previewUrl}
                            alt="Uploaded"
                            className="max-h-50"
                        />
                        <button
                            type="button"
                            onClick={handleDeleteImage}
                            className="mt-3 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700 max-h-10"
                        >
                            Delete Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
