import React from 'react';

interface ProgressBarProps {
    bgcolor: string;
    completed: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ bgcolor, completed }) => {
    return (
        <div className="h-5 w-full bg-slate-300 rounded-full my-12">
            <div
                className="h-full rounded-full text-right"
                style={{ width: `${completed}%`, backgroundColor: bgcolor }}
            >
                <span className="px-2 text-white font-bold">{`${completed}%`}</span>
            </div>
        </div>
    );
};

export default ProgressBar;
