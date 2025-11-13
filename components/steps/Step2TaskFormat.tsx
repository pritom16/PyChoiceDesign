
import React from 'react';
import { TaskFormat } from '../../types';

interface Step2Props {
    taskFormat: TaskFormat;
    setTaskFormat: React.Dispatch<React.SetStateAction<TaskFormat>>;
}

export const Step2TaskFormat: React.FC<Step2Props> = ({ taskFormat, setTaskFormat }) => {
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTaskFormat(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setTaskFormat(prev => ({ ...prev, [name]: checked }));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">Step 2: Choice Task Format</h2>
            <p className="text-gray-400 mb-6">Define the structure of each question presented to respondents.</p>
            
            <div className="space-y-6 max-w-md">
                <div className="flex flex-col">
                    <label htmlFor="alternatives" className="mb-2 font-semibold text-gray-300">Alternatives per Task</label>
                    <input
                        id="alternatives"
                        name="alternatives"
                        type="number"
                        min="2"
                        value={taskFormat.alternatives}
                        onChange={handleNumberChange}
                        className="bg-base-100 border border-gray-500 rounded-md px-3 py-2 text-white focus:ring-brand-secondary focus:border-brand-secondary"
                    />
                    <p className="text-xs text-gray-500 mt-1">Number of options to choose from in each question (excluding a 'None' option).</p>
                </div>
                
                <div className="flex flex-col">
                    <label htmlFor="tasks" className="mb-2 font-semibold text-gray-300">Choice Tasks per Respondent</label>
                    <input
                        id="tasks"
                        name="tasks"
                        type="number"
                        min="1"
                        value={taskFormat.tasks}
                        onChange={handleNumberChange}
                        className="bg-base-100 border border-gray-500 rounded-md px-3 py-2 text-white focus:ring-brand-secondary focus:border-brand-secondary"
                    />
                     <p className="text-xs text-gray-500 mt-1">Number of questions each person will answer.</p>
                </div>

                <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                    <input
                        id="statusQuo"
                        name="statusQuo"
                        type="checkbox"
                        checked={taskFormat.statusQuo}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 rounded border-gray-500 bg-base-100 text-brand-secondary focus:ring-brand-primary"
                    />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="statusQuo" className="font-medium text-gray-300">Include a "Status Quo" or "None" option</label>
                        <p className="text-gray-500 text-xs">Adds an opt-out alternative to each choice task (e.g., "I would not choose any of these").</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
