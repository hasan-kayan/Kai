import React from 'react';
import { Bot, Database, Mail, Zap, Settings, Trash2, Link } from 'lucide-react';
import { Node } from '../types';

interface WorkflowNodeProps {
  node: Node;
  isSelected: boolean;
  isConnecting: boolean;
  onDragStart: (node: Node, event: React.MouseEvent) => void;
  onClick: (node: Node) => void;
  onStartConnection: (nodeId: string) => void;
  onDelete: () => void;
}

const WorkflowNode: React.FC<WorkflowNodeProps> = ({
  node,
  isSelected,
  isConnecting,
  onDragStart,
  onClick,
  onStartConnection,
  onDelete
}) => {
  const getNodeIcon = () => {
    switch (node.type) {
      case 'agent': return <Bot size={20} />;
      case 'tool': return <Database size={20} />;
      case 'trigger': return <Zap size={20} />;
      case 'action': return <Mail size={20} />;
      default: return <Settings size={20} />;
    }
  };

  const getNodeColor = () => {
    switch (node.type) {
      case 'agent': return 'bg-blue-500';
      case 'tool': return 'bg-green-500';
      case 'trigger': return 'bg-yellow-500';
      case 'action': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDragStart(node, event);
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClick(node);
  };

  const handleConnectClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onStartConnection(node.id);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete();
  };

  return (
    <div
      className={`absolute select-none transform transition-all duration-200 ${
        isSelected ? 'scale-105' : 'scale-100'
      }`}
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: `translate(${node.position.x}px, ${node.position.y}px)`
      }}
    >
      <div
        className={`bg-white rounded-lg shadow-lg border-2 min-w-48 cursor-move transition-all duration-200 hover:shadow-xl ${
          isSelected ? 'border-blue-500 shadow-blue-200' : 'border-gray-200'
        } ${isConnecting ? 'ring-2 ring-blue-400' : ''}`}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        {/* Header */}
        <div className={`${getNodeColor()} text-white p-3 rounded-t-lg flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {getNodeIcon()}
            <span className="font-medium text-sm">{node.data.label}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleConnectClick}
              className="p-1 hover:bg-black hover:bg-opacity-20 rounded transition-colors"
              title="Connect to another node"
            >
              <Link size={14} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors"
              title="Delete node"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="text-sm text-gray-600 mb-2">
            {node.data.description || `${node.type} node`}
          </div>
          
          {/* Connection Points */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center gap-1">
              {node.inputs && node.inputs.length > 0 && (
                <div className="w-3 h-3 bg-gray-300 rounded-full border-2 border-white shadow-sm"></div>
              )}
              <span>{node.inputs?.length || 0} inputs</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{node.outputs?.length || 0} outputs</span>
              {node.outputs && node.outputs.length > 0 && (
                <div className="w-3 h-3 bg-gray-300 rounded-full border-2 border-white shadow-sm"></div>
              )}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="absolute -top-2 -right-2">
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowNode;