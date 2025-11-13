
export interface Attribute {
  id: string;
  name: string;
  levels: string[];
}

export interface TaskFormat {
  alternatives: number;
  tasks: number;
  statusQuo: boolean;
}

export enum ModelType {
  MNL = 'Multinomial Logit (MNL)',
  MixedLogit = 'Mixed Logit (MXL)',
  ErrorComponent = 'Error Component Logit (ECL)',
}

export enum Distribution {
  Normal = 'Normal',
  LogNormal = 'Log-Normal',
}

export interface Parameter {
  id: string;
  name: string;
  prior: number;
  distribution?: Distribution;
}

export interface ModelSpec {
  type: ModelType;
  parameters: Parameter[];
}

export interface DesignConfig {
    attributes: Omit<Attribute, 'id'>[];
    taskFormat: TaskFormat;
    modelSpec: {
        type: ModelType;
        parameters: Omit<Parameter, 'id'>[];
    };
}

export interface DesignResult {
    design: Record<string, string | number>[];
    dError: number;
    sError: number;
    syntax: {
        r: string;
        nlogit: string;
        biogeme: string;
    };
    explanation: string;
}
