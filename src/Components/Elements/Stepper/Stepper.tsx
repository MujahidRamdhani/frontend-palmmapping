/* eslint-disable react/prop-types */
import '../../../css/stepper.css';
import React, { useEffect, useRef, useState } from 'react';

// Example Step Components (for demonstration)
const Step1 = () => <div>Step 1 Component</div>;
const Step2 = () => <div>Step 2 Component</div>;
const Step3 = () => <div>Step 3 Component</div>;

interface StepConfig {
    uuid: string;
    createdAt: string;
    statusKonfirmasi: string;
    waktuPenerbitanSTDB: string;
    Component: React.ComponentType;
}

interface StepperProps {
    stepsConfig?: StepConfig[];
}

const Stepper2: React.FC<StepperProps> = ({ stepsConfig = [] }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isComplete, setIsComplete] = useState(false);
    const stepRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        console.log('stepsConfig:', stepsConfig);
    }, [stepsConfig]);

    if (!stepsConfig.length) {
        return <div>No steps provided</div>;
    }

    const handleNext = () => {
        setCurrentStep((prevStep) => {
            if (prevStep === stepsConfig.length) {
                setIsComplete(true);
                return prevStep;
            } else {
                return prevStep + 1;
            }
        });
    };

    const calculateProgressBarWidth = () => {
        if (stepsConfig.length <= 1) return 0;
        return ((currentStep - 1) / (stepsConfig.length - 1)) * 100;
    };

    const ActiveComponent = stepsConfig[currentStep - 1]?.Component;

    const steps = [
        {
            label: 'Pengajuan STDB',
            condition: (step: StepConfig) => !!step.createdAt,
        },
        {
            label: 'Konfirmasi STDB',
            condition: (step: StepConfig) =>
                step.statusKonfirmasi === 'diterima',
        },
        {
            label: 'Penerbitan STDB',
            condition: (step: StepConfig) => !!step.waktuPenerbitanSTDB,
        },
    ];

    return (
        <>
            <div className="stepper">
                <div className="progress-bar">
                    <div
                        className="progress"
                        style={{ width: `${calculateProgressBarWidth()}%` }}
                    ></div>
                </div>
                {steps.map((step, index) => {
                    const stepConfig = stepsConfig[0]; // Using the first element for simplicity
                    const isStepComplete = step.condition(stepConfig);
                    const isActiveStep = currentStep === index + 1;
                    const isStepRejected =
                        stepConfig.statusKonfirmasi === 'ditolak';

                    return (
                        <div
                            key={index}
                            ref={(el) => (stepRef.current[index] = el)}
                            className={`step ${isStepComplete ? 'complete' : ''} ${isActiveStep ? 'active' : ''} ${isStepRejected && index === 1 ? 'rejected' : ''}`}
                        >
                            <div className="step-number">
                                {isStepComplete && index === 0 ? (
                                    <span>&#10003;</span>
                                ) : isStepRejected && index === 1 ? (
                                    <span>&#10005;</span>
                                ) : isStepComplete && index === 1 ? (
                                    <span>&#10003;</span>
                                ) : isStepComplete && index === 2 ? (
                                    <span>&#10003;</span>
                                ) : (
                                    index + 1
                                )}

                                {/* {isStepComplete && index === 1 ? <span>&#10003;</span> : index + 1} */}
                            </div>
                            <div className="ml-8">
                                <div className="step-name font-semibold">
                                    {step.label}
                                </div>
                                <div className="step-name-time font-light">
                                    {index === 0 && stepConfig.createdAt}
                                    {index === 1 &&
                                        stepConfig.waktuStatusKonfirmasi}
                                    {index === 2 &&
                                        stepConfig.waktuPenerbitanSTDB}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button onClick={handleNext} disabled={isComplete}>
                Next
            </button>
        </>
    );
};

// Example usage of Stepper component
const exampleStepsConfig = [
    {
        uuid: '1',
        createdAt: '2023-08-16T14:05:04Z',
        statusKonfirmasi: 'ditolak',
        waktuPenerbitanSTDB: '123',
        waktuStatusKonfirmasi: '123',
        Component: Step1,
    },
    {
        uuid: '2',
        createdAt: '2023-08-16T14:05:04Z',
        statusKonfirmasi: 'ditolak',
        waktuStatusKonfirmasi: '123',
        waktuPenerbitanSTDB: '',
        Component: Step2,
    },
];

// Render the Stepper component
const Stepper = () => (
    <div>
        <Stepper2 stepsConfig={exampleStepsConfig} />
    </div>
);

export default Stepper;
