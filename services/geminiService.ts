import { GoogleGenAI, Type } from "@google/genai";
import { DesignConfig, DesignResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateDesign(config: DesignConfig): Promise<DesignResult> {
    
    // Dynamically create the properties for the design items based on user input
    const designItemProperties: { [key:string]: { type: Type; description?: string } } = {
        RespondentID: { type: Type.INTEGER, description: "Identifier for the respondent." },
        Task: { type: Type.INTEGER, description: "The choice task number for the respondent." },
        Alternative: { type: Type.INTEGER, description: "The alternative number within the task." },
    };
    
    config.attributes.forEach(attr => {
        if (attr.name) {
            // Using the user-provided name as the column header
            designItemProperties[attr.name] = { 
                type: Type.STRING, 
                description: `The level for the '${attr.name}' attribute for this alternative.`
            };
        }
    });
    
    // The Choice column is the dependent variable, to be filled in by survey respondents
    designItemProperties['Choice'] = { type: Type.INTEGER, description: "Placeholder for the dependent variable (1 if chosen, 0 otherwise)." };

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            design: {
                type: Type.ARRAY,
                description: "The experimental design as an array of objects, where each object is a row in the choice task table.",
                items: { 
                    type: Type.OBJECT,
                    properties: designItemProperties, // Use the dynamically generated properties
                }
            },
            dError: {
                type: Type.NUMBER,
                description: "The calculated D-error for the design."
            },
            sError: {
                type: Type.NUMBER,
                description: "The calculated S-error (sample size) for one parameter."
            },
            syntax: {
                type: Type.OBJECT,
                properties: {
                    r: { type: Type.STRING, description: "Estimation syntax for R (e.g., using mlogit package)." },
                    nlogit: { type: Type.STRING, description: "Estimation syntax for NLogit." },
                    biogeme: { type: Type.STRING, description: "Estimation syntax for Biogeme." }
                }
            },
            explanation: {
                type: Type.STRING,
                description: "A brief explanation of the generated design and its properties."
            }
        },
        required: ["design", "dError", "sError", "syntax", "explanation"]
    };

    const prompt = `
    You are an expert system that replicates the functionality of Ngene software for creating efficient experimental designs for stated preference surveys. Your primary goal is to generate a D-efficient design.

    Based on the following user-provided specifications, generate an optimal experimental design, efficiency metrics, and corresponding estimation syntax for popular software.

    **1. User Specifications:**
    - **Attributes & Levels:** ${JSON.stringify(config.attributes, null, 2)}
    - **Choice Task Format:**
      - Alternatives per task: ${config.taskFormat.alternatives}
      - Tasks per respondent: ${config.taskFormat.tasks}
      - Status Quo / 'None' option included: ${config.taskFormat.statusQuo ? 'Yes' : 'No'}
    - **Model Specification:**
      - Model Type: ${config.modelSpec.type}
      - Utility Functions (Parameters & Priors): ${JSON.stringify(config.modelSpec.parameters, null, 2)}

    **2. Your Task:**
    a. **Generate the Experimental Design:** Create a choice design table. The design must be D-efficient based on the provided priors and model specification. The columns MUST be named exactly as defined in the response schema: 'RespondentID', 'Task', 'Alternative', the provided attribute names, and 'Choice'. The 'Choice' column should be a placeholder (e.g., all zeros) as it is the dependent variable to be collected from respondents.
    b. **Calculate Efficiency Metrics:** Provide the final D-error and an S-error value for a representative parameter.
    c. **Generate Estimation Syntax:** Create ready-to-use syntax for R (using the 'mlogit' package), NLogit, and Biogeme to estimate the specified model using the generated design.
    d. **Provide an Explanation:** Briefly explain the structure of the design and why it is efficient for the user's model.

    **3. Output Format:**
    Return a single, valid JSON object that strictly adheres to the provided schema. Do not include any text or markdown formatting outside of the JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText) as DesignResult;
        
        // Basic validation
        if (!parsedResult.design || !parsedResult.syntax || !parsedResult.dError) {
             throw new Error("Invalid response structure from AI model.");
        }
        
        return parsedResult;

    } catch (error) {
        console.error("Error generating design with Gemini:", error);
        throw new Error("Failed to generate design. The AI model returned an unexpected response. Please check your inputs and try again.");
    }
}