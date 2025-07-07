import React from 'react';
import { Calendar, Play, Settings, MoreHorizontal } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
      <div className="p-6" onClick={onOpen}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
          </div>
          <div className="relative">
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <MoreHorizontal size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Updated {formatDate(project.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              {project.nodes.length} nodes
            </span>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 rounded-b-lg border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              <Play size={14} />
              Run
            </button>
            <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center gap-1">
              <Settings size={14} />
              Settings
            </button>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;