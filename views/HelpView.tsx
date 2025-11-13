
import React from 'react';
import { BrainCircuit, CheckCircle, Target, Database, FileText } from 'lucide-react';

export const HelpView: React.FC = () => {
    return (
        <div className="container mx-auto max-w-4xl py-8">
            <div className="bg-base-200 p-8 rounded-lg shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                    <BrainCircuit className="h-24 w-24 text-brand-secondary flex-shrink-0" />
                    <div>
                        <h1 className="text-4xl font-extrabold text-white mb-2">About ChoiceDesigner AI</h1>
                        <p className="text-lg text-gray-300">
                            An AI-powered tool for generating statistically efficient experimental designs for stated preference surveys. It simplifies a complex econometric process, making it accessible for researchers and market analysts.
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    <Section title="What is Stated Preference?">
                        <p>Stated preference surveys are a method used to understand how people make decisions. Respondents are shown a series of hypothetical scenarios or products (choice tasks) and are asked to choose their preferred option. By analyzing these choices, we can determine the value people place on different attributes (e.g., price, quality, time).</p>
                    </Section>

                    <Section title="Core Concepts">
                        <ConceptItem icon={Target} title="Efficient Experimental Design">
                            The goal is not just to create scenarios, but to create the *best possible* set of scenarios. An "efficient" design is one that provides the most statistical information from the fewest number of respondents, saving time and money.
                        </ConceptItem>
                         <ConceptItem icon={CheckCircle} title="D-Efficiency">
                            This is the primary optimization criterion used by the AI. It focuses on minimizing the volume of the joint confidence ellipsoid of the parameter estimates. In simple terms, it aims to produce the most precise parameter estimates possible for a given model.
                        </ConceptItem>
                         <ConceptItem icon={Database} title="Attributes, Levels & Priors">
                           - <strong>Attributes</strong> are the features of a product or service (e.g., 'Color').<br/>
                           - <strong>Levels</strong> are the specific values an attribute can take (e.g., 'Red', 'Blue').<br/>
                           - <strong>Priors</strong> are your best guesses for the model parameters *before* you run the survey. Efficient designs, especially Bayesian ones, rely on good priors to optimize the design effectively.
                        </ConceptItem>
                    </Section>

                    <Section title="How to Use the Designer">
                        <p className="mb-4">The Designer tab guides you through a 4-step process:</p>
                        <ol className="list-decimal list-inside space-y-2 text-gray-300">
                            <li><strong>Step 1: Attributes & Levels:</strong> Define the building blocks of your product/service.</li>
                            <li><strong>Step 2: Task Format:</strong> Specify how the choice questions will be structured.</li>
                            <li><strong>Step 3: Model & Priors:</strong> Tell the AI what statistical model you plan to use and provide your prior beliefs about the parameters. This is crucial for optimization.</li>
                            <li><strong>Step 4: Generate Design:</strong> The AI uses your inputs to generate a D-efficient design, along with code to help you analyze the results later.</li>
                        </ol>
                    </Section>
                     <Section title="Outputs">
                        <ConceptItem icon={FileText} title="Design & Syntax">
                           The final output includes the complete experimental design (ready to be imported into survey software) and syntax files for common estimation software like R, NLogit, or Biogeme. This bridges the gap between design and analysis.
                        </ConceptItem>
                    </Section>
                </div>
            </div>
        </div>
    );
};

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h2 className="text-2xl font-bold text-brand-secondary border-b-2 border-base-300 pb-2 mb-4">{title}</h2>
        <div className="text-gray-300 space-y-4">
            {children}
        </div>
    </div>
);

const ConceptItem: React.FC<{icon: React.ElementType, title: string, children: React.ReactNode}> = ({icon: Icon, title, children}) => (
     <div className="flex gap-4">
        <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-blue-400 mt-1" />
        </div>
        <div>
            <h3 className="font-semibold text-lg text-white">{title}</h3>
            <p className="text-gray-400">{children}</p>
        </div>
    </div>
)
