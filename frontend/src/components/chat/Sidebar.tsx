import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  Workflow, 
  FolderOpen,
  User,
  LogOut,
  Trash2,
  MoreHorizontal,
  Menu,
  X,
  Edit2,
  Check,
  Folder,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { authAPI, chatAPI } from '../../services/api';
import { supabase } from '../../config/supabase';

interface Chat {
  id: string;
  title: string;
  updated_at: string;
  project_id?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  chats: Chat[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { chatId } = useParams();
  const { user, logout } = useAuthStore();
  const { clearMessages, refreshTrigger } = useChatStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadChatsAndProjects();
    }
  }, [user, refreshTrigger]);

  const loadChatsAndProjects = async () => {
    try {
      setLoading(true);
      
      // Load projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Load all chats
      const response = await chatAPI.getUserChats(user!.id);
      const allChats = response.data.chats || [];

      // Group chats by project
      const projectsWithChats = (projectsData || []).map(project => ({
        ...project,
        chats: allChats.filter((chat: Chat) => chat.project_id === project.id)
      }));

      // Get chats not in any project
      const unassignedChats = allChats.filter((chat: Chat) => !chat.project_id);

      setProjects(projectsWithChats);
      setChats(unassignedChats);
    } catch (error) {
      console.error('Failed to load chats and projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      clearMessages();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNewChat = () => {
    clearMessages();
    if (window.innerWidth < 1024) {
      onToggle(); // Close sidebar on mobile after creating new chat
    }
  };

  const handleDeleteChat = async (chatIdToDelete: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this chat?')) {
      try {
        await chatAPI.deleteChat(chatIdToDelete);
        loadChatsAndProjects(); // Reload to update the UI
        
        if (chatId === chatIdToDelete) {
          window.location.href = '/chat';
        }
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          user_id: user!.id,
          name: newProjectName.trim(),
          description: ''
        }])
        .select()
        .single();

      if (error) throw error;

      setNewProjectName('');
      loadChatsAndProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  const updateProjectName = async (projectId: string, newName: string) => {
    if (!newName.trim()) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ name: newName.trim() })
        .eq('id', projectId);

      if (error) throw error;

      setEditingProject(null);
      loadChatsAndProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? Chats will be moved to unassigned.')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectId);

        if (error) throw error;

        loadChatsAndProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const moveChatToProject = async (chatId: string, projectId: string | null) => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ project_id: projectId })
        .eq('id', chatId);

      if (error) throw error;

      loadChatsAndProjects();
    } catch (error) {
      console.error('Failed to move chat:', error);
      if (error.message.includes('more than 5 chats')) {
        alert('This project already has the maximum of 5 chats.');
      }
    }
  };

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const formatChatTitle = (title: string) => {
    return title.length > 25 ? title.substring(0, 25) + '...' : title;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const menuItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Workflow, label: 'MCP Workflow', path: '/workflow', badge: 'New' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-gray-50 border-r border-gray-200 
        flex flex-col h-full transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-lg font-semibold text-gray-900">mcp/chat-bot</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
              icon={X}
            />
          </div>
          
          <Button
            onClick={handleNewChat}
            className="w-full"
            icon={Plus}
            variant="outline"
          >
            New Chat
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          <nav className="space-y-2 mb-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`
                  flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${location.pathname === item.path
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Projects Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Projects
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNewProjectName('New Project')}
                className="text-xs"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {/* New Project Input */}
            {newProjectName && (
              <div className="mb-3 p-2 bg-white rounded-lg border">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') createProject();
                    if (e.key === 'Escape') setNewProjectName('');
                  }}
                  onBlur={createProject}
                  className="w-full text-sm border-none outline-none"
                  placeholder="Project name..."
                  autoFocus
                />
              </div>
            )}

            {/* Projects List */}
            {projects.map((project) => (
              <div key={project.id} className="mb-2">
                <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg group">
                  <div 
                    className="flex items-center flex-1 cursor-pointer"
                    onClick={() => toggleProject(project.id)}
                  >
                    {expandedProjects.has(project.id) ? (
                      <ChevronDown className="w-4 h-4 mr-2 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-2 text-gray-500" />
                    )}
                    <Folder className="w-4 h-4 mr-2 text-gray-600" />
                    {editingProject === project.id ? (
                      <input
                        type="text"
                        defaultValue={project.name}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateProjectName(project.id, e.currentTarget.value);
                          }
                          if (e.key === 'Escape') setEditingProject(null);
                        }}
                        onBlur={(e) => updateProjectName(project.id, e.target.value)}
                        className="text-sm border-none outline-none bg-transparent flex-1"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {project.name}
                      </span>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                    <button
                      onClick={() => setEditingProject(project.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Project Chats */}
                {expandedProjects.has(project.id) && (
                  <div className="ml-6 space-y-1">
                    {project.chats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`group relative flex items-center px-3 py-2 rounded-lg transition-colors ${
                          chatId === chat.id 
                            ? 'bg-gray-200 text-gray-900' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Link
                          to={`/chat/${chat.id}`}
                          className="flex-1 min-w-0 block"
                          onClick={() => {
                            if (window.innerWidth < 1024) onToggle();
                          }}
                        >
                          <div className="text-sm font-medium truncate">
                            {formatChatTitle(chat.title)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(chat.updated_at)}
                          </div>
                        </Link>
                        
                        <button
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {project.chats.length < 5 && (
                      <div className="text-xs text-gray-500 px-3 py-1">
                        {5 - project.chats.length} more chats can be added
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Unassigned Chats */}
          {chats.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Recent Chats
              </h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                </div>
              ) : (
                <div className="space-y-1">
                  {chats.slice(0, 10).map((chat) => (
                    <div
                      key={chat.id}
                      className={`group relative flex items-center px-3 py-2 rounded-lg transition-colors ${
                        chatId === chat.id 
                          ? 'bg-gray-200 text-gray-900' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Link
                        to={`/chat/${chat.id}`}
                        className="flex-1 min-w-0 block"
                        onClick={() => {
                          if (window.innerWidth < 1024) onToggle();
                        }}
                      >
                        <div className="text-sm font-medium truncate">
                          {formatChatTitle(chat.title)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(chat.updated_at)}
                        </div>
                      </Link>
                      
                      <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              moveChatToProject(chat.id, e.target.value);
                            }
                          }}
                          className="text-xs bg-transparent border-none outline-none cursor-pointer"
                          title="Move to project"
                        >
                          <option value="">Move to...</option>
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-all"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {chats.length > 10 && (
                    <div className="text-xs text-gray-500 px-3 py-2">
                      And {chats.length - 10} more chats...
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full mr-3"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              icon={LogOut}
              className="ml-2"
            />
          </div>
        </div>
      </div>
    </>
  );
};