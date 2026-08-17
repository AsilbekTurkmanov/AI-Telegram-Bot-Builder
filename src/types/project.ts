export type ProjectStatus = 
  | 'Draft' 
  | 'Analyzing' 
  | 'Generating' 
  | 'Validating' 
  | 'Ready' 
  | 'Failed' 
  | 'Deploying' 
  | 'Deployed' 
  | 'Archived';

export interface ProjectFile {
  id: string;
  path: string;
  name: string;
  language: 'csharp' | 'typescript' | 'json' | 'sql' | 'dockerfile' | 'markdown' | 'xml' | 'plaintext';
  content: string;
  version: number;
  modifiedAt: string;
}

export interface ProjectVersion {
  version: number;
  description: string;
  createdAt: string;
  filesSnapshot: Record<string, string>; // path -> content
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  affectedFiles?: string[];
  riskLevel?: 'Low' | 'Medium' | 'High';
  diffs?: { file: string; before: string; after: string }[];
}

export interface GenerationStage {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  log: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  botName: string;
  description: string;
  botType: 'Restaurant' | 'E-Commerce' | 'Support' | 'Booking' | 'Custom';
  language: 'Uzbek' | 'English' | 'Russian';
  database: 'PostgreSQL' | 'SQLite';
  cache: 'Redis' | 'None';
  status: ProjectStatus;
  progress: number;
  currentStage: number;
  botToken?: string;
  githubRepo?: string;
  isBotConnected: boolean;
  createdAt: string;
  updatedAt: string;
  features: string[];
  files: ProjectFile[];
  versions: ProjectVersion[];
  messages: AiMessage[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Admin';
  plan: 'Free' | 'Pro' | 'Enterprise';
  apiGenerationsUsed: number;
  apiGenerationsLimit: number;
}
