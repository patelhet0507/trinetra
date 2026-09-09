export interface AttackVector {
  id: string;
  name: string;
  protocol: string;
  cveOrTtp: string;
  description: string;
  targetPort: number;
  simulatedPayload: string;
  mitreTactic: string;
}

export interface ComparisonRow {
  aspect: string;
  traditional: {
    title: string;
    description: string;
    status: 'negative' | 'neutral';
  };
  trinetra: {
    title: string;
    description: string;
    status: 'positive';
  };
}

export interface ArchitectureLayer {
  number: number;
  id: string;
  name: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  techStack: string[];
  keySpecs: {
    metric: string;
    label: string;
  }[];
  codeSnippet: string;
  codeLanguage: string;
  guardrail: string;
}

export interface PocLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRITICAL' | 'DECEPTION';
  source: 'PROXY_9000' | 'DECOY_2222' | 'STREAMLIT_ENGINE';
  message: string;
  ttp?: string;
}

export interface MitreTacticItem {
  id: string;
  name: string;
  code: string;
  severity: 'Critical' | 'High' | 'Medium';
  capturedCount: number;
  lastDetected: string;
}

export interface CapturedIncident {
  id: string;
  timestamp: string;
  attackerIp: string;
  country: string;
  targetPort: number;
  decoyAssigned: string;
  keystrokes: string[];
  canaryTriggered: string;
  status: 'Trapped & Active' | 'Isolated' | 'Snapshot Archived';
  mitreCode: string;
  sha256: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  status: 'Current PoC' | 'In Progress' | 'Planned';
  timeline: string;
  tagline: string;
  milestones: string[];
  highlight: boolean;
}
