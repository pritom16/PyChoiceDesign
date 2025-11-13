
import React from 'react';
import { Attribute, TaskFormat, ModelSpec, DesignResult, DesignConfig } from '../../types';
import { generateDesign } from '../../services/geminiService';
import { Zap } from 'lucide-react';

interface Step4Props {
    config: {
        attributes: Attribute[];
        taskFormat: TaskFormat;
        modelSpec: ModelSpec;
    };
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setResult: (result: DesignResult | null) => void;
}

export const Step4Generate: React.FC<Step4Props> = ({ config, setIsLoading, setError, setResult }) => {
    
    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);

        // Sanitize config for API call
        const apiConfig: DesignConfig = {
            attributes: config.attributes.map(({id, ...rest}) => rest),
            taskFormat: config.taskFormat,
            modelSpec: {
                type: config.modelSpec.type,
                parameters: config.modelSpec.parameters.map(({id, ...rest}) => rest)
            }
        };

        try {
            const result = await generateDesign(apiConfig);
            setResult(result);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Step 4: Generate Design</h2>
            <p className="text-gray-400 mb-6">Review your configuration and start the AI-powered design generation.</p>
            
            <div className="bg-base-300 p-6 rounded-lg text-left grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="space-y-4">
                    <SummarySection title="Attributes & Levels">
                        {config.attributes.map(attr => (
                            <div key={attr.id}>
                                <strong className="text-white">{attr.name || '[Untitled]'}</strong>: <span className="text-gray-400">{attr.levels.join(', ')}</span>
                            </div>
                        ))}
                    </SummarySection>

                    <SummarySection title="Task Format">
                        <p><strong className="text-white">Alternatives/Task:</strong> {config.taskFormat.alternatives}</p>
                        <p><strong className="text-white">Tasks/Respondent:</strong> {config.taskFormat.tasks}</p>
                        <p><strong className="text-white">Status Quo Option:</strong> {config.taskFormat.statusQuo ? 'Yes' : 'No'}</p>
                    </SummarySection>
                </div>

                <div className="space-y-4">
                    <SummarySection title="Model Specification">
                        <p><strong className="text-white">Model Type:</strong> {config.modelSpec.type}</p>
                        <strong className="text-white block mt-2">Parameters & Priors:</strong>
                        <ul className="list-disc list-inside text-gray-400 font-mono text-sm">
                            {config.modelSpec.parameters.map(p => (
                                <li key={p.id}>{p.name}: {p.prior}{config.modelSpec.type === 'Mixed Logit (MXL)' ? ` (${p.distribution})` : ''}</li>
                            ))}
                        </ul>
                    </SummarySection>
                </div>
            </div>

            <div className="mt-8">
                <button
                    onClick={handleGenerate}
                    className="flex items-center justify-center mx-auto bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 px-8 rounded-lg text-lg transition duration-200 shadow-lg hover:shadow-green-500/50"
                >
                     <Zap className="h-6 w-6 mr-3" />
                    Generate Design
                </button>
            </div>
        </div>
    );
};

const SummarySection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-lg font-semibold text-brand-secondary border-b border-base-100 pb-1 mb-2">{title}</h3>
        <div className="text-sm">{children}</div>
    </div>
);
