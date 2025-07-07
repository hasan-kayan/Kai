import React, { useState } from 'react';
import { Plus, Search, Calendar, Users, Zap, Database, Mail, FolderOpen } from 'lucide-react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';

interface DashboardProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onCreateProject: (name: string, description: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onOpenProject, onCreateProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderOpen, color: 'bg-blue-500' },
    { label: 'Active Workflows', value: '12', icon: Zap, color: 'bg-green-500' },
    { label: 'Agents Connected', value: '8', icon: Users, color: 'bg-purple-500' },
    { label: 'Tools Integrated', value: '24', icon: Database, color: 'bg-orange-500' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workflow Builder</h1>
            <p className="text-gray-600 mt-1">Create and manage your automation workflows</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            New Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id}
              project={project}
              onOpen={() => onOpenProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreate={onCreateProject}
        />
      )}
    </div>
  );
};

export default Dashboard;