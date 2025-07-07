export interface Node {
  id: string;
  type: 'agent' | 'tool' | 'trigger' | 'action';
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    icon?: string;
    config?: Record<string, any>;
  };
  inputs?: string[];
  outputs?: string[];
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  nodes: Node[];
  connections: Connection[];
}

export interface DragState {
  isDragging: boolean;
  draggedNode: Node | null;
  offset: { x: number; y: number };
}