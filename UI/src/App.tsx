import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import WorkflowBuilder from './components/WorkflowBuilder';
import { Project } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'workflow'>('dashboard');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Customer Support Automation',
      description: 'Automated customer support workflow with AI agents',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      nodes: [],
      connections: []
    },
    {
      id: '2',
      name: 'Data Processing Pipeline',
      description: 'ETL pipeline for processing customer data',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      nodes: [],
      connections: []
    },
    {
      id: '3',
      name: 'Marketing Campaign Automation',
      description: 'Automated marketing workflows and lead generation',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-16'),
      nodes: [],
      connections: []
    }
  ]);

  const handleOpenProject = (project: Project) => {
    setCurrentProject(project);
    setCurrentView('workflow');
  };

  const handleCreateProject = (name: string, description: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      nodes: [],
      connections: []
    };
    setProjects([...projects, newProject]);
    setCurrentProject(newProject);
    setCurrentView('workflow');
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setCurrentProject(updatedProject);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentProject(null);
  };

  return (
    <div className="h-screen bg-gray-50">
      {currentView === 'dashboard' ? (
        <Dashboard 
          projects={projects}
          onOpenProject={handleOpenProject}
          onCreateProject={handleCreateProject}
        />
      ) : (
        <WorkflowBuilder 
          project={currentProject!}
          onUpdateProject={handleUpdateProject}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;