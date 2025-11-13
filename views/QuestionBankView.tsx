
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

type Category = {
  title: string;
  description: string;
  questions: string[];
};

const questionData: Category[] = [
  {
    title: 'A. Standard Demographics',
    description: 'Basic identifying information about the respondent.',
    questions: [
      'What is your age?',
      'What is your gender?',
      'In which country do you currently reside?',
      'What is your postal/ZIP code?',
      'What is the highest level of education you have completed?',
    ],
  },
  {
    title: 'B. Socio-Economic Status',
    description: 'Information related to income, employment, and social standing.',
    questions: [
      'What is your current employment status?',
      'Which of the following best describes your occupation?',
      'What is your approximate annual household income before taxes?',
      'Do you own or rent your primary residence?',
      'How many vehicles does your household own?',
    ],
  },
  {
    title: 'C. Household Composition',
    description: 'Details about the respondent\'s family and living situation.',
    questions: [
      'Including yourself, how many people currently live in your household?',
      'How many children under the age of 18 live in your household?',
      'What is your current marital status?',
      'Are you the primary decision-maker for [product/service category] in your household?',
    ],
  },
  {
    title: 'D. Context-Specific Examples',
    description: 'Tailored questions for specific types of studies.',
    questions: [
      '**For Transportation Studies:**',
      'How do you typically commute to work/school?',
      'How many round trips do you make in a typical week?',
      'Do you have a valid driver\'s license?',
      '**For Health Studies:**',
      'Do you have a chronic health condition?',
      'How would you rate your overall health?',
      'Do you have public or private health insurance?',
      '**For Environmental Studies:**',
      'Are you a member of any environmental organizations?',
      'How concerned are you about climate change?',
      'Have you purchased any eco-friendly products in the last month?',
    ],
  },
  {
    title: 'E. Attitudinal & Behavioral',
    description: 'Questions about general attitudes or related past behaviors.',
    questions: [
      'Please indicate your level of agreement with the following statements (e.g., using a Likert scale):',
      '"I am always looking for the best value for my money."',
      '"I prefer to buy brands I am familiar with."',
      '"Environmental impact is an important factor in my purchasing decisions."',
      'How frequently have you used [related product/service] in the last year?',
      'What was the primary reason for your last purchase of [product category]?',
    ],
  },
];

const AccordionItem: React.FC<{ category: Category; isOpen: boolean; onClick: () => void }> = ({ category, isOpen, onClick }) => {
  return (
    <div className="border border-base-300 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-4 bg-base-200 hover:bg-base-300 focus:outline-none transition-colors"
      >
        <div className="text-left">
            <h3 className="font-semibold text-lg text-white">{category.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{category.description}</p>
        </div>
        
        {isOpen ? <ChevronDown className="h-6 w-6 text-brand-secondary" /> : <ChevronRight className="h-6 w-6 text-gray-400" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-base-100">
          <ul className="list-disc list-inside space-y-2 text-content">
            {category.questions.map((q, index) => (
              <li key={index} className="pl-2">{q.startsWith('**') ? <strong>{q.replace(/\*\*/g, '')}</strong> : q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const QuestionBankView: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">Survey Question Bank</h1>
                <p className="mt-2 text-lg text-gray-300">
                    A comprehensive list of questions for stated preference surveys.
                </p>
            </div>
            <div>
                {questionData.map((category, index) => (
                    <AccordionItem
                        key={index}
                        category={category}
                        isOpen={openIndex === index}
                        onClick={() => handleClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};
