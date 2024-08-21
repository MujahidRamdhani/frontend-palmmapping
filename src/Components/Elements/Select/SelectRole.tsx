import React, { useState } from 'react';
import '../../../css/placeholder.css';

interface InputFieldProps {
    id: string;
    register: any;
    errors: { [key: string]: { message?: string } };
    onChange: (value: string) => void; // Add this line
}

const SelectRole: React.FC<InputFieldProps> = ({
    id,
    register,
    errors,
    onChange,
}) => {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    return (
        <div className="">
            <label
                className="mb-2.5 block  dark:text-white text-sm font-medium leading-6 text-gray-900"
                htmlFor="Role"
            >
                Jenis Akun
            </label>

            <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                    id={id}
                    {...register(id)}
                    value={selectedOption}
                    onChange={(e) => {
                        setSelectedOption(e.target.value);
                        changeTextColor();
                        onChange(e.target.value); // Call the onChange prop with the selected value
                    }}
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 appearance-none ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2 ${
                        isOptionSelected ? 'text-black dark:text-white' : ''
                    }`}
                >
                    <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                    >
                        Pilih Jenis Akun
                    </option>
                    <option
                        value="petani"
                        className="text-body dark:text-bodydark"
                    >
                        Petani
                    </option>
                    <option
                        value="koperasi"
                        className="text-body dark:text-bodydark"
                    >
                        Koperasi
                    </option>
                </select>

                <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g opacity="0.8">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                fill=""
                            ></path>
                        </g>
                    </svg>
                </span>
            </div>
            {errors[id] && (
                <div className="text-red-500">{errors[id].message}</div>
            )}
        </div>
    );
};

export default SelectRole;
