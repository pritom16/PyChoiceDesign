
import React, { useEffect } from 'react';
import { ModelSpec, Attribute, ModelType, Parameter, Distribution } from '../../types';
import { Info } from 'lucide-react';

interface Step3Props {
    modelSpec: ModelSpec;
    setModelSpec: React.Dispatch<React.SetStateAction<ModelSpec>>;
    attributes: Attribute[];
}

export const Step3ModelSpec: React.FC<Step3Props> = ({ modelSpec, setModelSpec, attributes }) => {

    useEffect(() => {
        // Auto-generate parameters from attributes when component loads or attributes change
        const generatedParams: Parameter[] = attributes.flatMap(attr => {
            if (attr.name) { // Only generate if attribute has a name
                // For now, simple 1-to-1 mapping. A more complex UI could handle dummy/effects coding.
                return {
                    id: crypto.randomUUID(),
                    name: `B_${attr.name.replace(/\s+/g, '_')}`,
                    prior: 0,
                    distribution: Distribution.Normal
                };
            }
            return [];
        });
        setModelSpec(prev => ({ ...prev, parameters: generatedParams }));
    }, [attributes, setModelSpec]);

    const handleModelTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setModelSpec(prev => ({ ...prev, type: e.target.value as ModelType }));
    };

    const updateParameter = (id: string, field: keyof Parameter, value: any) => {
        setModelSpec(prev => ({
            ...prev,
            parameters: prev.parameters.map(p => p.id === id ? { ...p, [field]: value } : p)
        }));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">Step 3: Model & Priors</h2>
            <p className="text-gray-400 mb-6">Specify the model you intend to estimate. The design will be optimized for this model.</p>
            
            <div className="space-y-6">
                 <div>
                    <label htmlFor="modelType" className="block mb-2 font-semibold text-gray-300">Model Specification</label>
                    <select
                        id="modelType"
                        value={modelSpec.type}
                        onChange={handleModelTypeChange}
                        className="w-full max-w-sm bg-base-100 border border-gray-500 rounded-md px-3 py-2 text-white focus:ring-brand-secondary focus:border-brand-secondary"
                    >
                        {Object.values(ModelType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                
                 <div className="bg-blue-900/20 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg flex items-start" role="alert">
                     <Info className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                     <div>
                        <strong className="font-bold">About Priors: </strong>
                        <span className="block">Priors are your best guesses for parameter values. Accurate priors lead to more efficient designs. If you're unsure, use zero.</span>
                    </div>
                </div>


                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Utility Function Parameters</h3>
                    <div className="overflow-x-auto rounded-lg border border-base-300">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-200 uppercase bg-base-300">
                                <tr>
                                    <th className="px-4 py-3">Parameter Name</th>
                                    <th className="px-4 py-3">Prior Value</th>
                                    {modelSpec.type === ModelType.MixedLogit && (
                                        <th className="px-4 py-3">Distribution</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {modelSpec.parameters.map(param => (
                                    <tr key={param.id} className="bg-base-200 border-b border-base-300 last:border-b-0">
                                        <td className="px-4 py-2 font-mono">{param.name}</td>
                                        <td className="px-4 py-2">
                                            <input 
                                                type="number"
                                                step="0.1"
                                                value={param.prior}
                                                onChange={e => updateParameter(param.id, 'prior', parseFloat(e.target.value) || 0)}
                                                className="w-24 bg-base-100 border border-gray-500 rounded-md px-2 py-1 text-white"
                                            />
                                        </td>
                                        {modelSpec.type === ModelType.MixedLogit && (
                                             <td className="px-4 py-2">
                                                <select
                                                    value={param.distribution}
                                                    onChange={e => updateParameter(param.id, 'distribution', e.target.value as Distribution)}
                                                    className="bg-base-100 border border-gray-500 rounded-md px-2 py-1 text-white"
                                                >
                                                    {Object.values(Distribution).map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
