import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Eye, Code, FileText, Calendar, Mail, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

interface WorkflowResult {
  id: string;
  timestamp: string;
  tool: string;
  input: any;
  output: any;
  status: 'success' | 'error' | 'pending';
  executionTime: number;
}

export const MCPWorkflowPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowResult[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowResult | null>(null);
  const [viewMode, setViewMode] = useState<'json' | 'formatted'>('formatted');

  // Mock data for demonstration
  useEffect(() => {
    const mockWorkflows: WorkflowResult[] = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        tool: 'drive_search_files',
        input: { query: 'project proposal', limit: 10 },
        output: {
          files: [
            { name: 'Project Proposal Q1.docx', id: '123', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
            { name: 'Marketing Proposal.pdf', id: '456', mimeType: 'application/pdf' }
          ],
          total: 2
        },
        status: 'success',
        executionTime: 1250
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        tool: 'gmail_send_email',
        input: { 
          to: 'team@company.com', 
          subject: 'Weekly Update', 
          body: 'Here is the weekly project update...' 
        },
        output: { messageId: 'msg_789', status: 'sent' },
        status: 'success',
        executionTime: 890
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        tool: 'calendar_create_event',
        input: {
          title: 'Team Meeting',
          start: '2024-01-15T10:00:00Z',
          end: '2024-01-15T11:00:00Z',
          attendees: ['alice@company.com', 'bob@company.com']
        },
        output: { eventId: 'evt_abc123', status: 'created', link: 'https://calendar.google.com/event?eid=...' },
        status: 'success',
        executionTime: 2100
      }
    ];
    setWorkflows(mockWorkflows);
  }, []);

  const getToolIcon = (tool: string) => {
    if (tool.startsWith('drive_')) return HardDrive;
    if (tool.startsWith('gmail_')) return Mail;
    if (tool.startsWith('calendar_')) return Calendar;
    return FileText;
  };

  const getToolCategory = (tool: string) => {
    if (tool.startsWith('drive_')) return 'Google Drive';
    if (tool.startsWith('gmail_')) return 'Gmail';
    if (tool.startsWith('calendar_')) return 'Calendar';
    return 'Other';
  };

  const formatToolName = (tool: string) => {
    return tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderFormattedOutput = (tool: string, output: any) => {
    switch (true) {
      case tool.startsWith('drive_'):
        if (output.files) {
          return (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Files Found:</h4>
              {output.files.map((file: any, index: number) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-gray-500">({file.mimeType})</span>
                </div>
              ))}
              <p className="text-sm text-gray-600">Total: {output.total} files</p>
            </div>
          );
        }
        break;
      
      case tool.startsWith('gmail_'):
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-green-600" />
              <span className="font-medium text-gray-900">Email Sent Successfully</span>
            </div>
            <p className="text-sm text-gray-600">Message ID: {output.messageId}</p>
            <p className="text-sm text-gray-600">Status: {output.status}</p>
          </div>
        );
      
      case tool.startsWith('calendar_'):
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-gray-900">Event Created</span>
            </div>
            <p className="text-sm text-gray-600">Event ID: {output.eventId}</p>
            <p className="text-sm text-gray-600">Status: {output.status}</p>
            {output.link && (
              <a 
                href={output.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View in Google Calendar
              </a>
            )}
          </div>
        );
      
      default:
        return (
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(output, null, 2)}
          </pre>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/chat">
              <Button variant="ghost" size="sm" icon={ArrowLeft}>
                Back to Chat
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MCP Workflow Results</h1>
          <p className="text-gray-600 mt-2">
            View and analyze the JSON outputs from your MCP toolkit operations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflow List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Workflows</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {workflows.map((workflow) => {
                  const IconComponent = getToolIcon(workflow.tool);
                  return (
                    <div
                      key={workflow.id}
                      onClick={() => setSelectedWorkflow(workflow)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedWorkflow?.id === workflow.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          workflow.status === 'success' ? 'bg-green-100' : 
                          workflow.status === 'error' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          <IconComponent className={`w-4 h-4 ${
                            workflow.status === 'success' ? 'text-green-600' : 
                            workflow.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {formatToolName(workflow.tool)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getToolCategory(workflow.tool)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimestamp(workflow.timestamp)}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              workflow.status === 'success' ? 'bg-green-100 text-green-800' : 
                              workflow.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {workflow.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {workflow.executionTime}ms
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Workflow Details */}
          <div className="lg:col-span-2">
            {selectedWorkflow ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {formatToolName(selectedWorkflow.tool)}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {getToolCategory(selectedWorkflow.tool)} • {formatTimestamp(selectedWorkflow.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                        <button
                          onClick={() => setViewMode('formatted')}
                          className={`px-3 py-1 text-sm ${
                            viewMode === 'formatted' 
                              ? 'bg-gray-900 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Eye className="w-4 h-4 inline mr-1" />
                          Formatted
                        </button>
                        <button
                          onClick={() => setViewMode('json')}
                          className={`px-3 py-1 text-sm ${
                            viewMode === 'json' 
                              ? 'bg-gray-900 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Code className="w-4 h-4 inline mr-1" />
                          JSON
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Download}
                        onClick={() => downloadJSON(selectedWorkflow, `workflow-${selectedWorkflow.id}.json`)}
                      >
                        Export
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Input Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Input Parameters</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(selectedWorkflow.input, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Output Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Output Result</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {viewMode === 'formatted' ? (
                        renderFormattedOutput(selectedWorkflow.tool, selectedWorkflow.output)
                      ) : (
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(selectedWorkflow.output, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>

                  {/* Execution Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Execution Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-900">Status</p>
                        <p className={`text-lg font-semibold ${
                          selectedWorkflow.status === 'success' ? 'text-green-600' : 
                          selectedWorkflow.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {selectedWorkflow.status.toUpperCase()}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-900">Execution Time</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedWorkflow.executionTime}ms
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-900">Tool Category</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {getToolCategory(selectedWorkflow.tool)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Workflow
                </h3>
                <p className="text-gray-600">
                  Choose a workflow from the list to view its details and JSON output
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};