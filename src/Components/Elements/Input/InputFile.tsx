// InputFile.tsx
import React from 'react';
import '../../../css/placeholder.css';
import { FieldErrors } from 'react-hook-form';

interface InputFileProps {
    label: string;
    id: string;
    type: string;
    register: any;
    errors: FieldErrors; // Make message optional
}

const InputFile: React.FC<InputFileProps> = ({
    label,
    id,
    type,
    register,
    errors,
}) => {
    const errorMessage = errors?.[id]?.message as string | undefined;
    return (
        <div className="mb-3">
            <label
                htmlFor={id}
                className="mb-3 block text-black dark:text-white"
            >
                {label}
            </label>
            <div className="mt-2">
                <input
                    {...register(id)}
                    id={id}
                    type={type}
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
                {errors[id] && (
                    <div className="text-red-500">{errorMessage}</div>
                )}
            </div>
        </div>
    );
};

export default InputFile;
