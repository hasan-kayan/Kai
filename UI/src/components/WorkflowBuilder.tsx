import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, Play, Save, Zap, Users, Database, Mail, Bot, Settings, Plus, Trash2 } from 'lucide-react';
import { Project, Node, Connection, DragState } from '../types';
import WorkflowNode from './WorkflowNode';
import NodePalette from './NodePalette';
import NodePropertiesPanel from './NodePropertiesPanel';

interface WorkflowBuilderProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  onBackToDashboard: () => void;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ 
  project, 
  onUpdateProject, 
  onBackToDashboard 
}) => {
  const [nodes, setNodes] = useState<Node[]>(project.nodes);
  const [connections, setConnections] = useState<Connection[]>(project.connections);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedNode: null,
    offset: { x: 0, y: 0 }
  });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showNodePalette, setShowNodePalette] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Save project when nodes or connections change
  useEffect(() => {
    const updatedProject = { ...project, nodes, connections, updatedAt: new Date() };
    onUpdateProject(updatedProject);
  }, [nodes, connections, project, onUpdateProject]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            // Save is already handled by useEffect
            break;
          case 'a':
            e.preventDefault();
            setShowNodePalette(true);
            break;
          case 'Delete':
          case 'Backspace':
            if (selectedNode) {
              handleDeleteNode(selectedNode.id);
            }
            break;
        }
      }
      if (e.key === 'Escape') {
        setSelectedNode(null);
        setConnectingFrom(null);
        setShowNodePalette(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode]);

  const handleAddNode = (type: 'agent' | 'tool' | 'trigger' | 'action', label: string, icon: string) => {
    const newNode: Node = {
      id: Date.now().toString(),
      type,
      position: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 },
      data: { label, icon },
      inputs: type !== 'trigger' ? ['input'] : [],
      outputs: type !== 'action' ? ['output'] : []
    };
    
    setNodes([...nodes, newNode]);
    setShowNodePalette(false);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    setConnections(connections.filter(conn => conn.source !== nodeId && conn.target !== nodeId));
    setSelectedNode(null);
  };

  const handleNodeDragStart = (node: Node, event: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragState({
        isDragging: true,
        draggedNode: node,
        offset: {
          x: event.clientX - rect.left - node.position.x,
          y: event.clientY - rect.top - node.position.y
        }
      });
    }
  };

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (dragState.isDragging && dragState.draggedNode) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const newX = event.clientX - rect.left - dragState.offset.x;
        const newY = event.clientY - rect.top - dragState.offset.y;
        
        setNodes(nodes.map(node => 
          node.id === dragState.draggedNode!.id 
            ? { ...node, position: { x: newX, y: newY } }
            : node
        ));
      }
    }
  }, [dragState, nodes]);

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      draggedNode: null,
      offset: { x: 0, y: 0 }
    });
  };

  const handleNodeClick = (node: Node) => {
    if (connectingFrom) {
      if (connectingFrom !== node.id) {
        handleConnect(connectingFrom, node.id);
      }
      setConnectingFrom(null);
    } else {
      setSelectedNode(node);
    }
  };

  const handleConnect = (fromNodeId: string, toNodeId: string) => {
    if (fromNodeId !== toNodeId) {
      const existingConnection = connections.find(
        conn => conn.source === fromNodeId && conn.target === toNodeId
      );
      
      if (!existingConnection) {
        const newConnection: Connection = {
          id: Date.now().toString(),
          source: fromNodeId,
          target: toNodeId
        };
        setConnections([...connections, newConnection]);
      }
    }
    setConnectingFrom(null);
  };

  const handleStartConnection = (nodeId: string) => {
    setConnectingFrom(nodeId);
  };

  const handleDeleteConnection = (connectionId: string) => {
    setConnections(connections.filter(conn => conn.id !== connectionId));
  };

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.position : { x: 0, y: 0 };
  };

  const handleNodeUpdate = (updatedNode: Node) => {
    setNodes(nodes.map(node => node.id === updatedNode.id ? updatedNode : node));
    setSelectedNode(updatedNode);
  };

  const renderConnections = () => {
    return connections.map(connection => {
      const sourcePos = getNodePosition(connection.source);
      const targetPos = getNodePosition(connection.target);
      
      const startX = sourcePos.x + 192; // Node width
      const startY = sourcePos.y + 40; // Node height / 2
      const endX = targetPos.x;
      const endY = targetPos.y + 40;

      // Calculate control points for smooth curve
      const controlX1 = startX + (endX - startX) * 0.5;
      const controlY1 = startY;
      const controlX2 = startX + (endX - startX) * 0.5;
      const controlY2 = endY;

      const pathData = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
      
      // Calculate midpoint for delete button
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;

      return (
        <g key={connection.id}>
          <defs>
            <marker
              id={`arrowhead-${connection.id}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#3B82F6"
              />
            </marker>
          </defs>
          
          <path
            d={pathData}
            stroke="#3B82F6"
            strokeWidth="2"
            fill="none"
            markerEnd={`url(#arrowhead-${connection.id})`}
            className="hover:stroke-blue-700 transition-colors cursor-pointer"
          />
          
          <g className="opacity-0 hover:opacity-100 transition-opacity">
            <circle
              cx={midX}
              cy={midY}
              r="12"
              fill="white"
              stroke="#EF4444"
              strokeWidth="2"
              className="cursor-pointer"
              onClick={() => handleDeleteConnection(connection.id)}
            />
            <foreignObject
              x={midX - 6}
              y={midY - 6}
              width="12"
              height="12"
              className="pointer-events-none"
            >
              <div className="w-full h-full flex items-center justify-center">
                <Trash2 size={8} className="text-red-500" />
              </div>
            </foreignObject>
          </g>
        </g>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <div className="border-l border-gray-300 h-6"></div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
              <p className="text-sm text-gray-500">{project.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNodePalette(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
              Add Node
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <Play size={16} />
              Run Workflow
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
              <Save size={16} />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full bg-gray-100 relative cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          >
            {/* SVG for connections */}
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              {renderConnections()}
            </svg>

            {/* Nodes */}
            <div className="absolute inset-0" style={{ zIndex: 2 }}>
              {nodes.map(node => (
                <WorkflowNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  isConnecting={connectingFrom === node.id}
                  onDragStart={handleNodeDragStart}
                  onClick={handleNodeClick}
                  onStartConnection={handleStartConnection}
                  onDelete={() => handleDeleteNode(node.id)}
                />
              ))}
            </div>

            {/* Connection Preview */}
            {connectingFrom && (
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
                <div className="text-center py-4 bg-blue-50 border border-blue-200 rounded-lg m-4">
                  <p className="text-blue-700 font-medium">Click on another node to create a connection</p>
                  <p className="text-blue-600 text-sm">Press ESC to cancel</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <NodePropertiesPanel
            node={selectedNode}
            onUpdateNode={handleNodeUpdate}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>

      {/* Node Palette */}
      {showNodePalette && (
        <NodePalette
          onAddNode={handleAddNode}
          onClose={() => setShowNodePalette(false)}
        />
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs text-gray-600">
        <div className="font-semibold mb-2">Keyboard Shortcuts:</div>
        <div>Ctrl+A: Add Node</div>
        <div>Ctrl+S: Save</div>
        <div>Del: Delete Selected</div>
        <div>Esc: Cancel/Deselect</div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;