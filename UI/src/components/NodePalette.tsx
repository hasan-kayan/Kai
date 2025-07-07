import React from 'react';
import { X, Bot, Database, Mail, Zap, MessageSquare, Calendar, FileText, Globe } from 'lucide-react';

interface NodePaletteProps {
  onAddNode: (type: 'agent' | 'tool' | 'trigger' | 'action', label: string, icon: string) => void;
  onClose: () => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode, onClose }) => {
  const nodeTypes = [
    {
      category: 'Agents',
      nodes: [
        { type: 'agent' as const, label: 'AI Assistant', icon: 'Bot', description: 'Conversational AI agent' },
        { type: 'agent' as const, label: 'Data Analyst', icon: 'Database', description: 'Data analysis agent' },
        { type: 'agent' as const, label: 'Content Writer', icon: 'FileText', description: 'Content generation agent' },
        { type: 'agent' as const, label: 'Research Agent', icon: 'Globe', description: 'Web research agent' },
      ]
    },
    {
      category: 'Tools',
      nodes: [
        { type: 'tool' as const, label: 'Database Query', icon: 'Database', description: 'Execute database queries' },
        { type: 'tool' as const, label: 'Email Sender', icon: 'Mail', description: 'Send emails' },
        { type: 'tool' as const, label: 'File Processor', icon: 'FileText', description: 'Process files' },
        { type: 'tool' as const, label: 'Web Scraper', icon: 'Globe', description: 'Extract web data' },
      ]
    },
    {
      category: 'Triggers',
      nodes: [
        { type: 'trigger' as const, label: 'Webhook', icon: 'Zap', description: 'HTTP webhook trigger' },
        { type: 'trigger' as const, label: 'Schedule', icon: 'Calendar', description: 'Time-based trigger' },
        { type: 'trigger' as const, label: 'Email Received', icon: 'Mail', description: 'Email trigger' },
        { type: 'trigger' as const, label: 'File Upload', icon: 'FileText', description: 'File upload trigger' },
      ]
    },
    {
      category: 'Actions',
      nodes: [
        { type: 'action' as const, label: 'Send Email', icon: 'Mail', description: 'Send email action' },
        { type: 'action' as const, label: 'Save to Database', icon: 'Database', description: 'Database save action' },
        { type: 'action' as const, label: 'Generate Report', icon: 'FileText', description: 'Generate report action' },
        { type: 'action' as const, label: 'Send Notification', icon: 'MessageSquare', description: 'Send notification action' },
      ]
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot': return <Bot size={20} />;
      case 'Database': return <Database size={20} />;
      case 'Mail': return <Mail size={20} />;
      case 'Zap': return <Zap size={20} />;
      case 'MessageSquare': return <MessageSquare size={20} />;
      case 'Calendar': return <Calendar size={20} />;
      case 'FileText': return <FileText size={20} />;
      case 'Globe': return <Globe size={20} />;
      default: return <Bot size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Node</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nodeTypes.map(category => (
              <div key={category.category} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">{category.category}</h3>
                <div className="space-y-2">
                  {category.nodes.map(node => (
                    <button
                      key={node.label}
                      onClick={() => onAddNode(node.type, node.label, node.icon)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                          {getIcon(node.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">{node.label}</div>
                          <div className="text-sm text-gray-500 mt-1">{node.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodePalette;