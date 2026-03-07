import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import CopilotPanel from '../components/CopilotPanel';
import PredictionsPanel from '../components/PredictionsPanel';
import ComplaintDetailModal from '../components/ComplaintDetailModal';
import TransparencyMap from '../components/TransparencyMap';
import { useRealtimeEvents } from '../hooks/useRealtimeEvents';

interface HeatmapData {
  wardId: number;
  wardName: string;
  totalComplaints: number;
  unresolvedComplaints: number;
  avgResolutionTime: number;
  geojson?: any;
}

interface KPIData {
  totalComplaints: number;
  resolvedRatio: number;
  topDepartments: { name: string; count: number }[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [transparencyData, setTransparencyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'copilot'>('overview');
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initialize real-time events
  useRealtimeEvents();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch real complaints data
      const response = await api.get('/complaints');
      const fetchedComplaints = response.data.complaints;
      
      // Fetch transparency data for the map
      const transparencyResponse = await api.get('/transparency');
      const transparencyData = transparencyResponse.data;
      setTransparencyData(transparencyData);
      
      // Calculate real metrics from actual data
      const totalComplaints = fetchedComplaints.length;
      const resolvedComplaints = fetchedComplaints.filter((c: any) => c.status === 'resolved').length;
      const resolvedRatio = totalComplaints > 0 ? resolvedComplaints / totalComplaints : 0;
      
      // Calculate department statistics
      const deptCounts: { [key: string]: number } = {};
      fetchedComplaints.forEach((c: any) => {
        const dept = c.category || 'Unknown';
        deptCounts[dept] = (deptCounts[dept] || 0) + 1;
      });
      
      const topDepartments = Object.entries(deptCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
      
      const heatmapData: HeatmapData[] = transparencyData.complaintsByWard.map((ward: any) => ({
        wardId: ward.wardId || 0,
        wardName: ward.wardName,
        totalComplaints: ward.count,
        unresolvedComplaints: Math.floor(ward.count * 0.3), // Estimate 30% unresolved
        avgResolutionTime: transparencyData.avgResolutionTimeHours || 0
      }));
      
      const kpiData: KPIData = {
        totalComplaints,
        resolvedRatio,
        topDepartments
      };

      setHeatmapData(heatmapData);
      setKpiData(kpiData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-slate-50 text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-slate-400 mt-2">Monitor and manage city complaints and services</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => navigate('/transparency')}
                className="px-4 py-2 rounded-lg flex items-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-cyan-500/50 text-cyan-400 transition-all"
              >
                🏛️ Transparency Portal
              </button>
              <button 
                onClick={() => navigate('/submit-complaint')}
                className="px-4 py-2 rounded-lg flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-all"
              >
                ➕ New Complaint
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-slate-800 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={
                activeTab === 'overview'
                  ? 'border-cyan-500 text-cyan-400 border-b-2 py-2 px-1 font-medium text-sm transition-all'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700 py-2 px-1 border-b-2 font-medium text-sm transition-all'
              }
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('copilot')}
              className={
                activeTab === 'copilot'
                  ? 'border-cyan-500 text-cyan-400 border-b-2 py-2 px-1 font-medium text-sm transition-all'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700 py-2 px-1 border-b-2 font-medium text-sm transition-all'
              }
            >
              AI Copilot
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Section */}
            {kpiData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                      <div className="text-xl">📋</div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-slate-400">Total Complaints</h3>
                      <p className="text-3xl font-bold text-slate-50">{kpiData.totalComplaints}</p>
                      <p className="text-xs text-slate-500 mt-1">All time</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                      <div className="text-xl">✅</div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-slate-400">Resolved Ratio</h3>
                      <p className="text-3xl font-bold text-slate-50">{(kpiData.resolvedRatio * 100).toFixed(1)}%</p>
                      <p className="text-xs text-slate-500 mt-1">Resolution rate</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
                      <div className="text-xl">⏱️</div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-slate-400">Unresolved</h3>
                      <p className="text-3xl font-bold text-slate-50">
                        {Math.round(kpiData.totalComplaints * (1 - kpiData.resolvedRatio))}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Pending action</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                      <div className="text-xl">⏰</div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-slate-400">Avg Resolution</h3>
                      <p className="text-3xl font-bold text-slate-50">
                        {heatmapData.length > 0 
                          ? (heatmapData.reduce((sum, ward) => sum + ward.avgResolutionTime, 0) / heatmapData.length).toFixed(1)
                          : '0'
                        }h
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Hours</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Geographic Heatmap - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-50">Complaint Heatmap by Ward</h2>
                    <button 
                      onClick={() => navigate('/transparency')}
                      className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      View Details →
                    </button>
                  </div>
                  
                  {/* Interactive Map */}
                  <div className="h-96 rounded-lg overflow-hidden">
                    {transparencyData && (
                      <TransparencyMap 
                        complaintsByWard={heatmapData.map(ward => ({
                          wardId: ward.wardId,
                          wardName: ward.wardName,
                          count: ward.totalComplaints,
                          coordinates: transparencyData.complaintsByWard.find((w: any) => w.wardId === ward.wardId)?.coordinates
                        }))} 
                      />
                    )}
                  </div>

                  {/* Map Legend */}
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">Intensity:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span>Low</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span>Medium</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                        <span>High</span>
                      </div>
                    </div>
                    <span>Click wards for details</span>
                  </div>
                </div>
              </div>

              {/* Ward Statistics Sidebar - Takes 1 column */}
              <div className="lg:col-span-1">
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
                  <h2 className="text-lg font-semibold text-slate-50 mb-4">Ward Statistics</h2>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {heatmapData.map((ward) => (
                      <div key={ward.wardId} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 hover:border-cyan-500/50 transition-colors mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium text-slate-50">{ward.wardName}</h3>
                          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                            Ward {ward.wardId}
                          </span>
                        </div>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                          <div className="text-center">
                            <p className="text-slate-400 text-xs">Total</p>
                            <p className="font-semibold text-slate-50">{ward.totalComplaints}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-400 text-xs">Open</p>
                            <p className="font-semibold text-rose-400">{ward.unresolvedComplaints}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-400 text-xs">Avg Time</p>
                            <p className="font-semibold text-slate-50">{ward.avgResolutionTime}h</p>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Resolution Progress</span>
                            <span>{Math.round(((ward.totalComplaints - ward.unresolvedComplaints) / ward.totalComplaints) * 100)}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div 
                              className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${((ward.totalComplaints - ward.unresolvedComplaints) / ward.totalComplaints) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Departments Section */}
            {kpiData && kpiData.topDepartments.length > 0 && (
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-50">Top Complaint Categories</h2>
                  <button 
                    onClick={() => navigate('/admin')}
                    className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    Manage Complaints →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {kpiData.topDepartments.map((dept, index) => (
                    <div key={index} className="bg-slate-900 border border-slate-700 hover:border-cyan-500/50 p-4 rounded-xl text-center transition-all cursor-pointer">
                      <div className="text-2xl font-bold text-cyan-500">{dept.count}</div>
                      <div className="text-sm text-slate-400 mt-1">{dept.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Copilot Tab */}
        {activeTab === 'copilot' && (
          <div className="space-y-8">
            <CopilotPanel />
            <PredictionsPanel />
          </div>
        )}

        {/* Complaint Detail Modal */}
        {isModalOpen && selectedComplaint && (
          <ComplaintDetailModal
            complaint={selectedComplaint} isOpen={isModalOpen}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;