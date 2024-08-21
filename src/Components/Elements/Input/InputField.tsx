// InputField.tsx
import React from 'react';
import '../../../css/placeholder.css';
interface InputFieldProps {
    label: string;
    id: string;
    type: string;
    register: any;
    errors: { [key: string]: { message?: string } }; // Make message optional
    placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    id,
    type,
    register,
    errors,
    placeholder,
}) => {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium leading-6 text-gray-900"
            >
                {label}
            </label>
            <div className="mt-2">
                <input
                    {...register(id)}
                    id={id}
                    type={type}
                    autoComplete={id}
                    className=" placeholder w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                    placeholder={placeholder}
                />
                {errors[id] && (
                    <div className="text-red-500">{errors[id].message}</div>
                )}
            </div>
        </div>
    );
};

export default InputField;
