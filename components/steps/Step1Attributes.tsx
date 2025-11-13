
import React, { useState } from 'react';
import { Attribute } from '../../types';
import { PlusCircle, Trash2, X } from 'lucide-react';

interface Step1Props {
    attributes: Attribute[];
    setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
}

export const Step1Attributes: React.FC<Step1Props> = ({ attributes, setAttributes }) => {
    
    const addAttribute = () => {
        setAttributes([...attributes, { id: crypto.randomUUID(), name: '', levels: [''] }]);
    };

    const removeAttribute = (id: string) => {
        setAttributes(attributes.filter(attr => attr.id !== id));
    };

    const updateAttributeName = (id: string, name: string) => {
        setAttributes(attributes.map(attr => attr.id === id ? { ...attr, name } : attr));
    };

    const addLevel = (attrId: string) => {
        setAttributes(attributes.map(attr => 
            attr.id === attrId ? { ...attr, levels: [...attr.levels, ''] } : attr
        ));
    };

    const updateLevel = (attrId: string, levelIndex: number, value: string) => {
        setAttributes(attributes.map(attr => 
            attr.id === attrId 
                ? { ...attr, levels: attr.levels.map((level, i) => i === levelIndex ? value : level) } 
                : attr
        ));
    };
    
    const removeLevel = (attrId: string, levelIndex: number) => {
        setAttributes(attributes.map(attr => 
            attr.id === attrId 
                ? { ...attr, levels: attr.levels.filter((_, i) => i !== levelIndex) } 
                : attr
        ));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">Step 1: Define Attributes & Levels</h2>
            <p className="text-gray-400 mb-6">Specify the features of your product or service and their possible values.</p>
            
            <div className="space-y-6">
                {attributes.map((attribute) => (
                    <div key={attribute.id} className="bg-base-300 p-4 rounded-lg border border-gray-600">
                        <div className="flex items-center gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Attribute Name (e.g., Price)"
                                value={attribute.name}
                                onChange={(e) => updateAttributeName(attribute.id, e.target.value)}
                                className="flex-grow bg-base-100 border border-gray-500 rounded-md px-3 py-2 text-white focus:ring-brand-secondary focus:border-brand-secondary"
                            />
                            <button onClick={() => removeAttribute(attribute.id)} className="text-red-500 hover:text-red-400 p-2 rounded-full bg-base-100 hover:bg-red-900/50 transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                        
                        <div className="pl-4 border-l-2 border-gray-500">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Levels:</h4>
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {attribute.levels.map((level, levelIndex) => (
                                    <div key={levelIndex} className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder={`Level ${levelIndex + 1}`}
                                            value={level}
                                            onChange={(e) => updateLevel(attribute.id, levelIndex, e.target.value)}
                                            className="w-full bg-base-200 border border-gray-500 rounded-l-md px-3 py-1 text-white focus:ring-brand-secondary focus:border-brand-secondary"
                                        />
                                         <button
                                            onClick={() => removeLevel(attribute.id, levelIndex)}
                                            disabled={attribute.levels.length <= 1}
                                            className="bg-base-200 border-t border-b border-r border-gray-500 text-gray-400 hover:text-white hover:bg-red-500/50 p-1.5 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <X size={16}/>
                                        </button>
                                    </div>
                                ))}
                                 <button onClick={() => addLevel(attribute.id)} className="flex items-center justify-center text-sm bg-brand-secondary/20 text-brand-secondary hover:bg-brand-secondary/40 font-semibold py-1.5 px-3 rounded-md transition-colors">
                                    <PlusCircle size={16} className="mr-2"/>
                                    Add Level
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <button onClick={addAttribute} className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                     <PlusCircle size={20} className="mr-2" />
                    Add Attribute
                </button>
            </div>
        </div>
    );
};
