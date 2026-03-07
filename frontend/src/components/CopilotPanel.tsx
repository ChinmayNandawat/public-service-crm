import React, { useState } from 'react';
import { copilotAPI, utilityAPI } from '../services/api';
import { Ward, Department } from '../services/api';

interface CopilotResponse {
  analysis: string;
  recommendations: string[];
  citations: string[];
  source: 'llm' | 'fallback';
  llmEnabled: boolean;
  dataContext: {
    totalComplaints: number;
    analysisScope: string;
  };
}

const CopilotPanel: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [wardId, setWardId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [response, setResponse] = useState<CopilotResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [wards, setWards] = useState<Ward[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Sample questions for quick testing
  const sampleQuestions = [
    "What are the main issues in our city right now?",
    "Which ward has the most complaints and why?",
    "How is our resolution time performance?",
    "What departments need more resources?",
    "Are there any trends in recent complaints?"
  ];

  React.useEffect(() => {
    // Load wards and departments
    const fetchData = async () => {
      try {
        const [wardsResponse, departmentsResponse] = await Promise.all([
          utilityAPI.getWards(),
          utilityAPI.getDepartments()
        ]);
        setWards(wardsResponse.data);
        setDepartments(departmentsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse(null);

    try {
      const scope: any = {};
      if (wardId) scope.wardId = parseInt(wardId);
      if (departmentId) scope.departmentId = parseInt(departmentId);
      if (dateFrom) scope.dateFrom = dateFrom;
      if (dateTo) scope.dateTo = dateTo;

      const response = await copilotAPI.analyze({
        question: question.trim(),
        scope: Object.keys(scope).length > 0 ? scope : undefined
      });

      setResponse(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuestion = (sampleQuestion: string) => {
    setQuestion(sampleQuestion);
  };

  const clearForm = () => {
    setQuestion('');
    setWardId('');
    setDepartmentId('');
    setDateFrom('');
    setDateTo('');
    setResponse(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-sm shadow-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-50 mb-2 tracking-tight">AI Governance Copilot</h2>
        <p className="text-slate-400">Ask questions about municipal data and get advanced insights</p>
        
        <div className="mt-4 flex flex-col gap-2">
          {response?.llmEnabled && (
            <div className="inline-flex items-center px-3 py-1 bg-cyan-950/30 border border-cyan-800/50 rounded-full text-xs font-medium text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
              Neural Network Active (Gemini API)
            </div>
          )}
          
          {response && !response.llmEnabled && (
            <div className="inline-flex items-center px-3 py-1 bg-amber-950/30 border border-amber-800/50 rounded-full text-xs font-medium text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
              Fallback Analysis Mode Active
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-slate-400 mb-2 ml-4">
            Command Prompt
          </label>
          <div className="relative group">
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="w-full px-6 py-4 bg-slate-950 border border-slate-700 rounded-3xl text-slate-50 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none shadow-inner"
              placeholder="Query municipal data, trends, performance metrics..."
              required
            />
            <div className="absolute inset-0 rounded-3xl bg-cyan-400/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
          </div>
        </div>

        <div className="p-5 bg-slate-950/30 border border-slate-800/50 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="ward" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Sector
            </label>
            <select
              id="ward"
              value={wardId}
              onChange={(e) => setWardId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 appearance-none"
            >
              <option value="">All Sectors</option>
              {wards.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="department" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Division
            </label>
            <select
              id="department"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 appearance-none"
            >
              <option value="">All Divisions</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dateFrom" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Start Epoch
            </label>
            <input
              type="date"
              id="dateFrom"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 [color-scheme:dark]"
            />
          </div>

          <div>
            <label htmlFor="dateTo" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              End Epoch
            </label>
            <input
              type="date"
              id="dateTo"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="flex-1 bg-cyan-500 text-slate-950 font-bold px-8 py-3 rounded-full hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
          >
            {isLoading ? 'Processing Query...' : 'Execute Analysis'}
          </button>
          
          <button
            type="button"
            onClick={clearForm}
            className="px-8 py-3 bg-slate-800 text-slate-300 font-semibold rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors border border-slate-700"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Suggested Queries */}
      <div className="mb-8 p-6 bg-slate-950/40 border border-slate-800 rounded-3xl">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Suggested Protocols</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sampleQuestions.map((sampleQuestion, index) => (
            <button
              key={index}
              onClick={() => handleSampleQuestion(sampleQuestion)}
              className="text-left px-4 py-3 text-sm bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-cyan-400 hover:text-cyan-300 transition-all hover:border-cyan-800 group"
            >
              <span className="text-slate-600 mr-2 group-hover:text-cyan-600">&gt;</span> {sampleQuestion}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-5 bg-red-950/30 border border-red-900/50 rounded-2xl">
          <div className="flex items-center">
            <span className="text-red-500 mr-3">⚠️</span>
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mb-8 p-8 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full blur-sm"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
          <p className="text-cyan-400 font-medium tracking-widest uppercase text-sm animate-pulse">Synthesizing Data...</p>
        </div>
      )}

      {/* Response Display - Bento Grid */}
      {response && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-3 p-6 bg-slate-950/50 border border-slate-800/80 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2"></span> Executive Summary
            </h3>
            <p className="text-slate-200 whitespace-pre-wrap leading-relaxed font-light text-lg">{response.analysis}</p>
          </div>

          <div className="md:col-span-2 p-6 bg-slate-900/60 border border-slate-800/60 rounded-3xl backdrop-blur-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Strategic Directives</h3>
            {response.recommendations.length > 0 ? (
              <ul className="space-y-3">
                {response.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-cyan-500 font-bold mr-3 mt-0.5 opacity-70">0{index + 1}</span>
                    <span className="text-slate-300">{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic text-sm">No specific directives generated.</p>
            )}
          </div>

          <div className="md:col-span-1 space-y-6 flex flex-col">
            <div className="p-6 bg-slate-900/60 border border-slate-800/60 rounded-3xl flex-1 backdrop-blur-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Telemetry</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Total Signals</div>
                  <div className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                    {response.dataContext.totalComplaints}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Engine Type</div>
                  <div className="text-sm font-medium text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg inline-block border border-slate-700">
                    {response.source === 'llm' ? 'Neural Subsystem' : 'Fallback Ruleset'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Analyzer Scope</div>
                  <div className="text-sm text-slate-400 leading-tight">
                    {response.dataContext.analysisScope || 'Global'}
                  </div>
                </div>
              </div>
            </div>

            {response.citations.length > 0 && (
              <div className="p-6 bg-slate-900/60 border border-slate-800/60 rounded-3xl backdrop-blur-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Data Nodes</h3>
                <div className="flex flex-wrap gap-2">
                  {response.citations.map((citation, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-slate-800/80 border border-slate-700 text-cyan-300/80 rounded-md text-xs font-mono"
                    >
                      {citation}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default CopilotPanel;
