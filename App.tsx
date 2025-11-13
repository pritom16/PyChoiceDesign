
import React, { useState } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { DesignerView } from './views/DesignerView';
import { QuestionBankView } from './views/QuestionBankView';
import { HelpView } from './views/HelpView';
import { BrainCircuit, BookText, HelpCircle, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
    return (
        <HashRouter>
            <div className="min-h-screen flex flex-col bg-base-100 text-content">
                <Header />
                <main className="flex-grow p-4 md:p-8">
                    <Routes>
                        <Route path="/" element={<DesignerView />} />
                        <Route path="/questions" element={<QuestionBankView />} />
                        <Route path="/help" element={<HelpView />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </HashRouter>
    );
};

const Header: React.FC = () => {
    const location = useLocation();
    const navItems = [
        { path: '/', label: 'Designer', icon: LayoutGrid },
        { path: '/questions', label: 'Question Bank', icon: BookText },
        { path: '/help', label: 'About', icon: HelpCircle },
    ];
    
    return (
        <header className="bg-base-200 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                         <BrainCircuit className="h-8 w-8 text-brand-secondary" />
                        <h1 className="text-xl font-bold text-white">ChoiceDesigner AI</h1>
                    </div>
                    <nav className="hidden md:flex space-x-2">
                        {navItems.map(item => (
                            <NavLink 
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    isActive
                                        ? 'bg-brand-primary text-white'
                                        : 'text-gray-300 hover:bg-base-300 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="h-5 w-5 mr-2" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>
             <div className="md:hidden bg-base-300">
                <nav className="flex justify-around p-2">
                    {navItems.map(item => (
                        <NavLink 
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center p-2 rounded-md text-xs font-medium transition-colors duration-200 w-full text-center ${
                                isActive
                                    ? 'bg-brand-primary text-white'
                                    : 'text-gray-300 hover:bg-base-200'
                                }`
                            }
                        >
                            <item.icon className="h-5 w-5 mb-1" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}

const Footer: React.FC = () => {
    return (
        <footer className="bg-base-200 mt-auto">
            <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} ChoiceDesigner AI. An AI-Assisted Tool for Experimental Design.</p>
            </div>
        </footer>
    );
};


export default App;
