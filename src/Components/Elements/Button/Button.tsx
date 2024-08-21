import React from 'react';

interface ButtonProps {
    isSubmitting?: boolean;
    children: React.ReactNode;
    width?: string | 'full';
    marginTop?: string;
    type?: 'submit' | 'reset' | 'button';
    onClick?: () => void ;
}

const Button: React.FC<ButtonProps> = ({
    isSubmitting,
    children,
    width,
    marginTop,
    type,
    onClick,
}) => {
    return (
        <button
            type={type}
            className={`flex w-${width} justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-${marginTop}`}
            disabled={isSubmitting}
            onClick={onClick}
        >
            {isSubmitting ? 'Memuat...' : children}
        </button>
    );
};

export default Button;
