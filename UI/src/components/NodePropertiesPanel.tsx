import React, { useState } from 'react';
import { X, Settings, Bot, Database, Mail, Zap } from 'lucide-react';
import { Node } from '../types';

interface NodePropertiesPanelProps {
  node: Node;
  onUpdateNode: (node: Node) => void;
  onClose: () => void;
}

const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({
  node,
  onUpdateNode,
  onClose
}) => {
  const [label, setLabel] = useState(node.data.label);
  const [description, setDescription] = useState(node.data.description || '');
  const [config, setConfig] = useState(node.data.config || {});

  const handleSave = () => {
    const updatedNode: Node = {
      ...node,
      data: {
        ...node.data,
        label,
        description,
        config
      }
    };
    onUpdateNode(updatedNode);
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  const getIcon = () => {
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

  const renderConfigFields = () => {
    switch (node.type) {
      case 'agent':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Prompt
              </label>
              <textarea
                value={config.systemPrompt || ''}
                onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter system prompt for the AI agent..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature || 0.7}
                onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">
                Current: {config.temperature || 0.7}
              </div>
            </div>
          </div>
        );
      case 'tool':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Endpoint
              </label>
              <input
                type="url"
                value={config.endpoint || ''}
                onChange={(e) => handleConfigChange('endpoint', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout (seconds)
              </label>
              <input
                type="number"
                value={config.timeout || 30}
                onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="300"
              />
            </div>
          </div>
        );
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trigger Type
              </label>
              <select
                value={config.triggerType || 'webhook'}
                onChange={(e) => handleConfigChange('triggerType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="webhook">Webhook</option>
                <option value="schedule">Schedule</option>
                <option value="email">Email</option>
                <option value="file">File Upload</option>
              </select>
            </div>
            {config.triggerType === 'schedule' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cron Expression
                </label>
                <input
                  type="text"
                  value={config.cronExpression || '0 */1 * * *'}
                  onChange={(e) => handleConfigChange('cronExpression', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0 */1 * * *"
                />
              </div>
            )}
          </div>
        );
      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Type
              </label>
              <select
                value={config.actionType || 'email'}
                onChange={(e) => handleConfigChange('actionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="email">Send Email</option>
                <option value="database">Save to Database</option>
                <option value="notification">Send Notification</option>
                <option value="webhook">Call Webhook</option>
              </select>
            </div>
            {config.actionType === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Template
                </label>
                <textarea
                  value={config.emailTemplate || ''}
                  onChange={(e) => handleConfigChange('emailTemplate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter email template..."
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${getNodeColor()} text-white p-2 rounded-lg`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Node Properties</h3>
              <p className="text-sm text-gray-500 capitalize">{node.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter description..."
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Configuration</h4>
            {renderConfigFields()}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodePropertiesPanel;