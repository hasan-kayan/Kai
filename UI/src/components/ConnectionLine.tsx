import React from 'react';
import { X } from 'lucide-react';
import { Connection } from '../types';

interface ConnectionLineProps {
  connection: Connection;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  onDelete: () => void;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  sourcePosition,
  targetPosition,
  onDelete
}) => {
  const startX = sourcePosition.x + 192; // Node width + padding
  const startY = sourcePosition.y + 40; // Node height / 2
  const endX = targetPosition.x;
  const endY = targetPosition.y + 40;

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
    <g>
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
          onClick={onDelete}
        />
        <g transform={`translate(${midX - 6}, ${midY - 6})`}>
          <X size={12} className="text-red-500 pointer-events-none" />
        </g>
      </g>
    </g>
  );
};

export default ConnectionLine;