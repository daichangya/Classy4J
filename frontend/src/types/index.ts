export interface Agent {
  id?: number;
  name: string;
  description: string;
  tools: string[];
  workflow: string;
  status: 'IDLE' | 'RUNNING' | 'ERROR';
  configuration?: string;
}

export interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

export interface Tool {
  id?: number;
  name: string;
  description: string;
  implementation: string;
  parameters: ToolParameter[];
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
}

export interface WorkflowStep {
  type: string;
  targetId: string;
  task?: string;
  parameters: string;
}

export interface Workflow {
  id?: number;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'DRAFT' | 'ACTIVE' | 'RUNNING' | 'COMPLETED' | 'ERROR';
} 