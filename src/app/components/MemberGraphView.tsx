import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraphVisualization } from './GraphVisualization';
import { Sidebar } from './Sidebar';
import { SideEffect, Treatment } from '../data/covid-data';

export default function MemberGraphView() {
  const [selectedNode, setSelectedNode] = useState<SideEffect | Treatment | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNodeClick = (node: SideEffect | Treatment) => {
    setSelectedNode(node);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setTimeout(() => setSelectedNode(null), 300);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
        animate={{
          background: [
            'linear-gradient(135deg, #e0e7ff 0%, #fae8ff 50%, #fce7f3 100%)',
            'linear-gradient(135deg, #dbeafe 0%, #f3e8ff 50%, #fef3c7 100%)',
            'linear-gradient(135deg, #f0f9ff 0%, #fae8ff 50%, #ffe4e6 100%)',
            'linear-gradient(135deg, #e0e7ff 0%, #fae8ff 50%, #fce7f3 100%)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, -30, -10],
              x: [-5, 5, -5],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Header with entrance animation */}
      <motion.div 
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.h1 
            className="text-2xl text-foreground mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            🚀 Scrum团队任务看板
          </motion.h1>
          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            探索团队角色与任务 - 点击节点查看详细信息和完成进度
          </motion.p>
        </motion.div>
      </motion.div>

      <GraphVisualization onNodeClick={handleNodeClick} />
      
      <Sidebar 
        selectedNode={selectedNode}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />

      {/* Animated backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={handleSidebarClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
