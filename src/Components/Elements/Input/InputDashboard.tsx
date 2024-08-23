import React from 'react';
import { FieldErrors, FieldError } from 'react-hook-form';
interface InputFieldProps {
    label: string;
    id: string;
    type: string;
    register: any;
    errors: FieldErrors; // Make message optional
    placeholder?: string;
    valueAsNumber?: any; // Making valueAsNumber optional
    readOnly?: boolean;
    hidden?: boolean;
    value?: string;
    disabled?: boolean;
    onChange?: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    Hektar?: string;
    span?: string;
}

const InputDashboard: React.FC<InputFieldProps> = ({
    label,
    id,
    type,
    register,
    errors,
    placeholder,
    valueAsNumber, // Now optional
    hidden,
    value,
    disabled,
    onChange,
    span,
    readOnly,
}) => {
    return (
        <div className="mb-4.5">
            {hidden ? null : (
                <label
                    htmlFor={id}
                    className="mb-2.5 block text-black dark:text-white"
                >
                    {label} <span className="text-meta-1">*</span>
                </label>
            )}
            <div className="flex items-center">
                <input
                    {...register(id, { valueAsNumber })}
                    id={id}
                    type={type}
                    autoComplete={id}
                    placeholder={placeholder}
                    className={`w-full ${span ? 'rounded-l' : 'rounded'} border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    disabled={id === 'kawasan' || disabled ? true : false}
                    hidden={hidden}
                    value={value}
                    onChange={onChange}
                   
                     readOnly={readOnly}
                />
                {span && (
                    <span className="px-3 py-3.5 text-slate-400 text-sm bg-whiter border-[1.5px] border-stroke rounded-r font-medium">
                        {span}
                    </span>
                )}
            </div>
            {errors[id]?.message && typeof errors[id]?.message === 'string' && (
                <div className="text-red-500">{errors[id]?.message}</div>
            )}
        </div>
    );
};

export default InputDashboard;
