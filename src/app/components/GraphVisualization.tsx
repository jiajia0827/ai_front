import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { covidSideEffects, mainNode, treatments, SideEffect, Treatment } from '../data/covid-data';

interface GraphNode {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  isMain?: boolean;
  isTreatment?: boolean;
  parentId?: string;
  baseX: number;
  baseY: number;
}

interface GraphVisualizationProps {
  onNodeClick: (node: SideEffect | Treatment) => void;
}

interface WrappedText {
  lines: string[];
  fontSize: number;
  lineHeight: number;
}

export function GraphVisualization({ onNodeClick }: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMovedDuringDrag, setHasMovedDuringDrag] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);

  // Animation loop for floating effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + 0.016); // ~60fps
    }, 16);

    return () => clearInterval(interval);
  }, []);

  // Helper function to wrap text within circle bounds
  const wrapText = (text: string, nodeType: 'main' | 'sideEffect' | 'treatment'): WrappedText => {
    const radius = nodeType === 'main' ? 70 : nodeType === 'sideEffect' ? 50 : 32;
    const padding = 8;
    const maxWidth = (radius - padding) * 2;
    const fontSize = nodeType === 'main' ? 13 : nodeType === 'sideEffect' ? 11 : 9;
    const lineHeight = fontSize * 1.2;
    
    const charWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor(maxWidth / charWidth);
    
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      if (testLine.length <= maxCharsPerLine) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word.substring(0, maxCharsPerLine));
          currentLine = word.substring(maxCharsPerLine);
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    const maxLines = Math.floor((radius - padding) * 2 / lineHeight);
    if (lines.length > maxLines) {
      lines.splice(maxLines - 1);
      lines[maxLines - 1] = lines[maxLines - 1] + '...';
    }
    
    return {
      lines,
      fontSize,
      lineHeight
    };
  };

  // Initialize node positions with base positions for floating animation
  const initializeNodes = useCallback(() => {
    const mainNodeData = {
      id: mainNode.id,
      name: mainNode.name,
      x: dimensions.width / 2,
      y: dimensions.height / 2,
      baseX: dimensions.width / 2,
      baseY: dimensions.height / 2,
      color: mainNode.color,
      isMain: true
    };

    const sideEffectNodes = covidSideEffects.map((effect, index) => {
      const angle = (2 * Math.PI * index) / covidSideEffects.length;
      const radius = Math.min(dimensions.width, dimensions.height) * 0.32;
      const baseX = dimensions.width / 2 + Math.cos(angle) * radius;
      const baseY = dimensions.height / 2 + Math.sin(angle) * radius;
      return {
        id: effect.id,
        name: effect.name,
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        color: effect.color
      };
    });

    // Create treatment nodes positioned around their parent side effects
    const treatmentNodes = treatments.map((treatment, treatmentIndex) => {
      const parentSideEffect = sideEffectNodes.find(node => node.id === treatment.sideEffectId);
      if (!parentSideEffect) return null;

      // Get treatments for this side effect
      const siblingTreatments = treatments.filter(t => t.sideEffectId === treatment.sideEffectId);
      const treatmentIndexInGroup = siblingTreatments.findIndex(t => t.id === treatment.id);
      
      // Position treatments in a circle around their parent
      const treatmentAngle = (2 * Math.PI * treatmentIndexInGroup) / siblingTreatments.length;
      const treatmentRadius = 80; // Distance from parent
      
      const baseX = parentSideEffect.baseX + Math.cos(treatmentAngle) * treatmentRadius;
      const baseY = parentSideEffect.baseY + Math.sin(treatmentAngle) * treatmentRadius;

      return {
        id: treatment.id,
        name: treatment.name,
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        color: treatment.color,
        isTreatment: true,
        parentId: treatment.sideEffectId
      };
    }).filter(Boolean) as GraphNode[];

    return [mainNodeData, ...sideEffectNodes, ...treatmentNodes];
  }, [dimensions]);

  const [nodes, setNodes] = useState<GraphNode[]>(() => initializeNodes());

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    setNodes(initializeNodes());
  }, [initializeNodes]);

  // Update floating positions
  useEffect(() => {
    if (!isDragging) {
      setNodes(prevNodes => 
        prevNodes.map((node, index) => {
          const floatOffset = Math.sin(animationTime * 0.8 + index * 0.5) * (node.isTreatment ? 4 : 8);
          const floatOffsetX = Math.cos(animationTime * 0.6 + index * 0.3) * (node.isTreatment ? 3 : 6);
          return {
            ...node,
            x: node.id === draggedNode ? node.x : node.baseX + floatOffsetX,
            y: node.id === draggedNode ? node.y : node.baseY + floatOffset
          };
        })
      );
    }
  }, [animationTime, isDragging, draggedNode]);

  const mainNodeData = nodes.find(n => n.isMain)!;
  const sideEffectNodes = nodes.filter(n => !n.isMain && !n.isTreatment);
  const treatmentNodes = nodes.filter(n => n.isTreatment);

  const sideEffectConnections = [
    ['cough', 'breathlessness'],
    ['fever', 'fatigue'],
    ['headache', 'brain-fog'],
    ['taste-smell', 'brain-fog'],
    ['chest-pain', 'heart-palpitations'],
    ['fatigue', 'muscle-pain'],
    ['anxiety', 'brain-fog']
  ];

  const getMousePosition = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = dimensions.width / rect.width;
    const scaleY = dimensions.height / rect.height;
    
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }, [dimensions]);

  const handleMouseDown = useCallback((event: React.MouseEvent, nodeId: string) => {
    event.preventDefault();
    event.stopPropagation();
    
    const mousePos = getMousePosition(event);
    setIsDragging(true);
    setDraggedNode(nodeId);
    setDragStart(mousePos);
    setHasMovedDuringDrag(false);
  }, [getMousePosition]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !draggedNode) return;

    const mousePos = getMousePosition(event);
    const deltaX = mousePos.x - dragStart.x;
    const deltaY = mousePos.y - dragStart.y;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      setHasMovedDuringDrag(true);
    }

    const node = nodes.find(n => n.id === draggedNode);
    const nodeRadius = node?.isMain ? 60 : node?.isTreatment ? 30 : 45;
    
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === draggedNode
          ? { 
              ...node, 
              x: Math.max(nodeRadius, Math.min(dimensions.width - nodeRadius, mousePos.x)),
              y: Math.max(nodeRadius, Math.min(dimensions.height - nodeRadius, mousePos.y)),
              baseX: Math.max(nodeRadius, Math.min(dimensions.width - nodeRadius, mousePos.x)),
              baseY: Math.max(nodeRadius, Math.min(dimensions.height - nodeRadius, mousePos.y))
            }
          : node
      )
    );
  }, [isDragging, draggedNode, getMousePosition, dragStart, dimensions, nodes]);

  const handleMouseUp = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging && draggedNode && !hasMovedDuringDrag) {
      const sideEffect = covidSideEffects.find(s => s.id === draggedNode);
      const treatment = treatments.find(t => t.id === draggedNode);
      
      if (sideEffect) {
        onNodeClick(sideEffect);
      } else if (treatment) {
        onNodeClick(treatment);
      }
    }
    
    setIsDragging(false);
    setDraggedNode(null);
    setHasMovedDuringDrag(false);
  }, [isDragging, draggedNode, hasMovedDuringDrag, onNodeClick]);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setDraggedNode(null);
    setHasMovedDuringDrag(false);
  }, []);

  return (
    <div className="w-full h-full relative">
      <svg
        ref={svgRef}
        className="w-full h-full cursor-default"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.8">
              <animate attributeName="stop-opacity" 
                values="0.3;0.8;0.3" 
                dur="3s" 
                repeatCount="indefinite"/>
            </stop>
            <stop offset="50%" stopColor="#c7d2fe" stopOpacity="0.9">
              <animate attributeName="stop-opacity" 
                values="0.4;0.9;0.4" 
                dur="3s" 
                repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.8">
              <animate attributeName="stop-opacity" 
                values="0.3;0.8;0.3" 
                dur="3s" 
                repeatCount="indefinite"/>
            </stop>
          </linearGradient>

          <linearGradient id="treatmentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.6">
              <animate attributeName="stop-opacity" 
                values="0.2;0.6;0.2" 
                dur="4s" 
                repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.4">
              <animate attributeName="stop-opacity" 
                values="0.2;0.4;0.2" 
                dur="4s" 
                repeatCount="indefinite"/>
            </stop>
          </linearGradient>
        </defs>

        {/* Animated connections between main node and side effects */}
        {sideEffectNodes.map((node, index) => (
          <motion.line
            key={`main-${node.id}`}
            x1={mainNodeData.x}
            y1={mainNodeData.y}
            x2={node.x}
            y2={node.y}
            stroke="url(#connectionGradient)"
            strokeWidth="2"
            opacity="0.7"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 1.2, 
              ease: "easeInOut" 
            }}
          />
        ))}

        {/* Connections between side effect nodes */}
        {sideEffectConnections.map(([nodeId1, nodeId2], index) => {
          const node1 = nodes.find(n => n.id === nodeId1);
          const node2 = nodes.find(n => n.id === nodeId2);
          if (!node1 || !node2) return null;

          return (
            <motion.line
              key={`${nodeId1}-${nodeId2}`}
              x1={node1.x}
              y1={node1.y}
              x2={node2.x}
              y2={node2.y}
              stroke="#f0f4f8"
              strokeWidth="1"
              opacity="0.5"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 0.5,
                strokeDashoffset: [0, -10]
              }}
              transition={{ 
                pathLength: { delay: 1 + index * 0.1, duration: 0.8 },
                opacity: { delay: 1 + index * 0.1, duration: 0.8 },
                strokeDashoffset: { 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "linear" 
                }
              }}
            />
          );
        })}

        {/* Connections between side effects and treatments */}
        {treatmentNodes.map((treatmentNode, index) => {
          const parentNode = nodes.find(n => n.id === treatmentNode.parentId);
          if (!parentNode) return null;

          return (
            <motion.line
              key={`treatment-${treatmentNode.id}`}
              x1={parentNode.x}
              y1={parentNode.y}
              x2={treatmentNode.x}
              y2={treatmentNode.y}
              stroke="url(#treatmentGradient)"
              strokeWidth="1.5"
              opacity="0.6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ 
                delay: 2 + index * 0.05, 
                duration: 0.8, 
                ease: "easeInOut" 
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, index) => {
          const radius = node.isMain ? 70 : node.isTreatment ? 32 : 50;
          const nodeType = node.isMain ? 'main' : node.isTreatment ? 'treatment' : 'sideEffect';
          const wrappedText = wrapText(node.name, nodeType);
          const totalTextHeight = wrappedText.lines.length * wrappedText.lineHeight;
          const startY = node.y - (totalTextHeight / 2) + (wrappedText.lineHeight / 2);
          
          // Get member or treatment data
          const memberData = !node.isMain && !node.isTreatment ? 
            covidSideEffects.find(s => s.id === node.id) : null;
          const treatmentData = node.isTreatment ? 
            treatments.find(t => t.id === node.id) : null;

          return (
            <motion.g 
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: node.isTreatment ? 2.5 + index * 0.03 : index * 0.1, 
                duration: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill={node.color}
                stroke="white"
                strokeWidth={node.isTreatment ? "2" : "3"}
                className="cursor-pointer"
                filter={hoveredNode === node.id ? "url(#glow)" : "none"}
                animate={{
                  scale: hoveredNode === node.id && !isDragging ? 1.08 : 
                         draggedNode === node.id ? 1.05 : 1,
                  boxShadow: hoveredNode === node.id ? 
                    "0 10px 25px -5px rgba(0, 0, 0, 0.2)" : 
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                whileHover={{ 
                  scale: 1.08,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => !isDragging && setHoveredNode(node.id)}
                onMouseLeave={() => !isDragging && setHoveredNode(null)}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                style={{
                  transformOrigin: `${node.x}px ${node.y}px`,
                  opacity: draggedNode === node.id ? 0.8 : 1
                }}
              />
              
              {/* Member avatar (for team members) */}
              {memberData?.avatar && (
                <motion.text
                  x={node.x}
                  y={node.y - 18}
                  textAnchor="middle"
                  className="fill-black pointer-events-none select-none font-bold"
                  fontSize="16"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                >
                  {memberData.avatar}
                </motion.text>
              )}
              
              {/* Task status icon (for tasks) */}
              {treatmentData?.status && (
                <motion.text
                  x={node.x - radius + 8}
                  y={node.y - radius + 12}
                  className="pointer-events-none select-none"
                  fontSize="14"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.5 + index * 0.03 + 0.3, duration: 0.4 }}
                >
                  {treatmentData.status}
                </motion.text>
              )}
              
              <motion.text
                x={node.x}
                y={memberData?.avatar ? startY + 10 : startY}
                textAnchor="middle"
                className="fill-black pointer-events-none select-none drop-shadow-sm"
                fontSize={wrappedText.fontSize}
                fontWeight="600"
                animate={{
                  scale: hoveredNode === node.id && !isDragging ? 1.02 : 1
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {wrappedText.lines.map((line, lineIndex) => (
                  <motion.tspan
                    key={lineIndex}
                    x={node.x}
                    dy={lineIndex === 0 ? 0 : wrappedText.lineHeight}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ 
                      delay: (node.isTreatment ? 2.5 + index * 0.03 : index * 0.1) + lineIndex * 0.1 + 0.3,
                      duration: 0.4
                    }}
                  >
                    {line}
                  </motion.tspan>
                ))}
              </motion.text>

              {/* Pulsing ring effect for main node */}
              {node.isMain && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={radius + 10}
                  fill="none"
                  stroke={node.color}
                  strokeWidth="2"
                  opacity="0.3"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}

              {/* Subtle glow for treatment nodes */}
              {node.isTreatment && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={radius + 5}
                  fill="none"
                  stroke={node.color}
                  strokeWidth="1"
                  opacity="0.2"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.05, 0.2]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                />
              )}
            </motion.g>
          );
        })}

        {/* Enhanced hover tooltip */}
        <AnimatePresence>
          {hoveredNode && !nodes.find(n => n.id === hoveredNode)?.isMain && !isDragging && (
            <motion.g
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.rect
                x={nodes.find(n => n.id === hoveredNode)!.x - 60}
                y={nodes.find(n => n.id === hoveredNode)!.y - (nodes.find(n => n.id === hoveredNode)?.isTreatment ? 70 : 85)}
                width="120"
                height="38"
                fill="rgba(0,0,0,0.9)"
                rx="8"
                className="pointer-events-none"
                animate={{
                  boxShadow: [
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <text
                x={nodes.find(n => n.id === hoveredNode)!.x}
                y={nodes.find(n => n.id === hoveredNode)!.y - (nodes.find(n => n.id === hoveredNode)?.isTreatment ? 57 : 72)}
                textAnchor="middle"
                className="fill-white pointer-events-none text-xs"
              >
                Drag to move
              </text>
              <text
                x={nodes.find(n => n.id === hoveredNode)!.x}
                y={nodes.find(n => n.id === hoveredNode)!.y - (nodes.find(n => n.id === hoveredNode)?.isTreatment ? 43 : 58)}
                textAnchor="middle"
                className="fill-white pointer-events-none text-xs"
              >
                Click for details
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Drag instruction for main node */}
        <AnimatePresence>
          {hoveredNode === 'scrum-project' && !isDragging && (
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.rect
                x={nodes.find(n => n.id === 'scrum-project')!.x - 45}
                y={nodes.find(n => n.id === 'scrum-project')!.y - 95}
                width="90"
                height="24"
                fill="rgba(0,0,0,0.9)"
                rx="8"
                className="pointer-events-none"
                animate={{
                  y: [
                    nodes.find(n => n.id === 'scrum-project')!.y - 95,
                    nodes.find(n => n.id === 'scrum-project')!.y - 98,
                    nodes.find(n => n.id === 'scrum-project')!.y - 95
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <text
                x={nodes.find(n => n.id === 'scrum-project')!.x}
                y={nodes.find(n => n.id === 'scrum-project')!.y - 82}
                textAnchor="middle"
                className="fill-white pointer-events-none text-xs"
              >
                Drag to move
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}