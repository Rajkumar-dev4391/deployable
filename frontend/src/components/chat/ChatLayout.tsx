import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { Sidebar } from './Sidebar';
import { ChatInterface } from './ChatInterface';

export const ChatLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on mobile when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header with menu button */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            icon={Menu}
            onClick={() => setSidebarOpen(true)}
            className="mr-4"
          />
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center mr-2">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="font-semibold text-gray-900">MCP Chat Bot</span>
          </div>
        </div>
        
        <ChatInterface />
      </div>
    </div>
  );
};