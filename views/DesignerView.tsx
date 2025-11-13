
import React, { useState } from 'react';
import { Attribute, TaskFormat, ModelSpec, ModelType, DesignResult, DesignConfig } from '../types';
import { Step1Attributes } from '../components/steps/Step1Attributes';
import { Step2TaskFormat } from '../components/steps/Step2TaskFormat';
import { Step3ModelSpec } from '../components/steps/Step3ModelSpec';
import { Step4Generate } from '../components/steps/Step4Generate';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const TOTAL_STEPS = 4;

export const DesignerView: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    
    const [attributes, setAttributes] = useState<Attribute[]>([
        { id: crypto.randomUUID(), name: 'Price', levels: ['$10', '$15', '$20'] },
        { id: crypto.randomUUID(), name: 'Quality', levels: ['Low', 'Medium', 'High'] },
        { id: crypto.randomUUID(), name: 'Time', levels: ['20 mins', '10 mins', '5 mins'] }
    ]);
    const [taskFormat, setTaskFormat] = useState<TaskFormat>({ alternatives: 2, tasks: 8, statusQuo: true });
    const [modelSpec, setModelSpec] = useState<ModelSpec>({
        type: ModelType.MNL,
        parameters: []
    });

    const [result, setResult] = useState<DesignResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    const resetAll = () => {
        setCurrentStep(1);
        setAttributes([
            { id: crypto.randomUUID(), name: 'Price', levels: ['$10', '$15', '$20'] },
            { id: crypto.randomUUID(), name: 'Quality', levels: ['Low', 'Medium', 'High'] },
            { id: crypto.randomUUID(), name: 'Time', levels: ['20 mins', '10 mins', '5 mins'] }
        ]);
        setTaskFormat({ alternatives: 2, tasks: 8, statusQuo: true });
        setModelSpec({ type: ModelType.MNL, parameters: [] });
        setResult(null);
        setError(null);
        setIsLoading(false);
    }
    
    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorScreen message={error} onRetry={resetAll} />;
    }

    if (result) {
        return <ResultsDisplay result={result} onReset={resetAll} />;
    }

    return (
        <div className="container mx-auto max-w-5xl">
            <StepIndicator currentStep={currentStep} />

            <div className="bg-base-200 p-6 md:p-8 rounded-lg shadow-xl min-h-[400px]">
                {currentStep === 1 && <Step1Attributes attributes={attributes} setAttributes={setAttributes} />}
                {currentStep === 2 && <Step2TaskFormat taskFormat={taskFormat} setTaskFormat={setTaskFormat} />}
                {currentStep === 3 && <Step3ModelSpec modelSpec={modelSpec} setModelSpec={setModelSpec} attributes={attributes} />}
                {currentStep === 4 && <Step4Generate 
                    config={{ attributes, taskFormat, modelSpec }} 
                    setIsLoading={setIsLoading}
                    setError={setError}
                    setResult={setResult}
                    />}
            </div>

            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center bg-base-300 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Back
                </button>
                 <button 
                    onClick={resetAll}
                    className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset
                </button>
                <button
                    onClick={nextStep}
                    disabled={currentStep === TOTAL_STEPS}
                    className="flex items-center bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight className="h-5 w-5 ml-2" />
                </button>
            </div>
        </div>
    );
};

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ['Attributes & Levels', 'Task Format', 'Model & Priors', 'Generate Design'];
    return (
        <div className="mb-8">
            <ol className="flex items-center w-full">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isCurrent = currentStep === stepNumber;
                    return (
                        <li key={step} className={`flex w-full items-center ${index < steps.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block" : ''} ${isCompleted || isCurrent ? 'after:border-brand-secondary' : 'after:border-base-300'}`}>
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${isCurrent ? 'bg-brand-secondary' : isCompleted ? 'bg-blue-800' : 'bg-base-300'}`}>
                                {isCompleted ? (
                                    <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                    </svg>
                                ) : (
                                    <span className={`font-bold ${isCurrent ? 'text-white' : 'text-gray-400'}`}>{stepNumber}</span>
                                )}
                            </div>
                            <div className="ml-4 hidden md:block">
                                <h3 className={`font-medium ${isCurrent ? 'text-white' : 'text-gray-400'}`}>{step}</h3>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

const LoadingScreen: React.FC = () => (
    <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-secondary mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Generating Your Design...</h2>
        <p className="text-gray-400">Our AI is running complex simulations. This may take a moment.</p>
    </div>
);

const ErrorScreen: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="text-center p-8 bg-base-200 rounded-lg shadow-xl">
        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h2 className="text-2xl font-bold text-white mb-2">An Error Occurred</h2>
        <p className="text-red-400 bg-base-300 p-3 rounded-md mb-6">{message}</p>
        <button
            onClick={onRetry}
            className="flex items-center justify-center mx-auto bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-6 rounded-lg transition duration-200"
        >
             <RotateCcw className="h-5 w-5 mr-2" />
            Start Over
        </button>
    </div>
);
