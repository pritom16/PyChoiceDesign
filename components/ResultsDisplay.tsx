
import React, { useState } from 'react';
import { DesignResult } from '../types';
import { RotateCcw, Download, Copy, Lightbulb, BarChart2, Code } from 'lucide-react';

type Tab = 'design' | 'syntax' | 'metrics';

export const ResultsDisplay: React.FC<{ result: DesignResult; onReset: () => void }> = ({ result, onReset }) => {
    const [activeTab, setActiveTab] = useState<Tab>('design');
    
    const headers = result.design.length > 0 ? Object.keys(result.design[0]) : [];

    const downloadCSV = () => {
        const csvRows = [
            headers.join(','), 
            ...result.design.map(row => 
                headers.map(header => JSON.stringify(row[header], (_, value) => value === null ? '' : value)).join(',')
            )
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'experimental_design.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-white">Design Generation Complete</h1>
                <p className="mt-2 text-lg text-gray-300">
                    Your efficient experimental design is ready.
                </p>
            </div>

            <div className="bg-base-200 p-4 sm:p-6 rounded-lg shadow-xl">
                 <div className="flex items-start bg-blue-900/20 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
                    <Lightbulb className="h-6 w-6 mr-3 flex-shrink-0" />
                    <div>
                        <strong className="font-bold">AI Explanation: </strong>
                        <span className="block sm:inline">{result.explanation}</span>
                    </div>
                </div>

                <div className="border-b border-base-300 mb-4">
                    <nav className="-mb-px flex space-x-2 sm:space-x-4" aria-label="Tabs">
                        <TabButton icon={BarChart2} label="Design" activeTab={activeTab} tabName="design" onClick={() => setActiveTab('design')} />
                        <TabButton icon={Code} label="Estimation Syntax" activeTab={activeTab} tabName="syntax" onClick={() => setActiveTab('syntax')} />
                        <TabButton icon={BarChart2} label="Metrics" activeTab={activeTab} tabName="metrics" onClick={() => setActiveTab('metrics')} />
                    </nav>
                </div>

                <div className="mt-4">
                    {activeTab === 'design' && <DesignTable headers={headers} data={result.design} onDownload={downloadCSV} />}
                    {activeTab === 'syntax' && <SyntaxDisplay syntax={result.syntax} />}
                    {activeTab === 'metrics' && <MetricsDisplay dError={result.dError} sError={result.sError} />}
                </div>
            </div>

            <div className="text-center mt-8">
                <button
                    onClick={onReset}
                    className="flex items-center justify-center mx-auto bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                >
                     <RotateCcw className="h-5 w-5 mr-2" />
                    Create New Design
                </button>
            </div>
        </div>
    );
};

const TabButton: React.FC<{icon: React.ElementType, label: string, activeTab: Tab, tabName: Tab, onClick: () => void}> = ({ icon: Icon, label, activeTab, tabName, onClick}) => (
    <button
        onClick={onClick}
        className={`flex items-center whitespace-nowrap py-3 px-2 sm:px-4 border-b-2 font-medium text-sm transition-colors duration-200
            ${ activeTab === tabName
                ? 'border-brand-secondary text-brand-secondary'
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
            }`
        }
    >
        <Icon className="h-5 w-5 mr-2" />
        {label}
    </button>
)

const DesignTable: React.FC<{ headers: string[], data: Record<string, any>[], onDownload: () => void }> = ({ headers, data, onDownload }) => (
    <div>
         <div className="flex justify-end mb-4">
            <button onClick={onDownload} className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                <Download className="h-5 w-5 mr-2" />
                Download CSV
            </button>
        </div>
        <div className="overflow-x-auto max-h-[500px] rounded-lg border border-base-300">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-200 uppercase bg-base-300 sticky top-0">
                    <tr>
                        {headers.map(header => <th key={header} className="px-6 py-3">{header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index} className="bg-base-200 border-b border-base-300 hover:bg-base-300">
                            {headers.map(header => <td key={header} className="px-6 py-4">{row[header]}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


const SyntaxDisplay: React.FC<{ syntax: DesignResult['syntax'] }> = ({ syntax }) => {
    const [currentSyntax, setCurrentSyntax] = useState<'r' | 'nlogit' | 'biogeme'>('r');
    
    const syntaxMap = { r: 'R (mlogit)', nlogit: 'NLogit', biogeme: 'Biogeme' };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Add toast notification here in a real app
    };

    return (
        <div>
            <div className="flex justify-center mb-4 rounded-lg bg-base-300 p-1">
                {Object.keys(syntaxMap).map(key => (
                     <button
                        key={key}
                        onClick={() => setCurrentSyntax(key as 'r' | 'nlogit' | 'biogeme')}
                        className={`w-full py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                            currentSyntax === key ? 'bg-brand-primary text-white shadow' : 'text-gray-300 hover:bg-base-200'
                        }`}
                    >
                        {syntaxMap[key as keyof typeof syntaxMap]}
                    </button>
                ))}
            </div>
            <div className="relative bg-gray-900 rounded-lg p-4 font-mono text-sm text-white overflow-x-auto">
                <button
                    onClick={() => copyToClipboard(syntax[currentSyntax])}
                    className="absolute top-2 right-2 flex items-center bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded-lg text-xs transition-colors"
                >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                </button>
                <pre><code>{syntax[currentSyntax]}</code></pre>
            </div>
        </div>
    );
};

const MetricsDisplay: React.FC<{ dError: number; sError: number }> = ({ dError, sError }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-base-300 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-gray-300">D-Error</h3>
            <p className="text-4xl font-bold text-brand-secondary mt-2">{dError.toExponential(4)}</p>
            <p className="text-sm text-gray-400 mt-2">Lower is better. Measures overall parameter precision.</p>
        </div>
        <div className="bg-base-300 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-gray-300">S-Error</h3>
            <p className="text-4xl font-bold text-brand-secondary mt-2">{sError.toFixed(2)}</p>
            <p className="text-sm text-gray-400 mt-2">Sample size needed for one parameter to be significant. Lower is better.</p>
        </div>
    </div>
);
