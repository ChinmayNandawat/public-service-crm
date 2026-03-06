import { useState, useEffect } from 'react';

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
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Mock heatmap data - replace with actual API call when available
      const mockHeatmapData: HeatmapData[] = [
        { wardId: 1, wardName: 'Ward 1', totalComplaints: 45, unresolvedComplaints: 12, avgResolutionTime: 24.5 },
        { wardId: 2, wardName: 'Ward 2', totalComplaints: 38, unresolvedComplaints: 8, avgResolutionTime: 18.2 },
        { wardId: 3, wardName: 'Ward 3', totalComplaints: 52, unresolvedComplaints: 15, avgResolutionTime: 31.7 },
      ];

      // Mock KPI data - replace with actual API call when available
      const mockKpiData: KPIData = {
        totalComplaints: 135,
        resolvedRatio: 0.76,
        topDepartments: [
          { name: 'Water Supply', count: 42 },
          { name: 'Road Damage', count: 38 },
          { name: 'Sanitation', count: 28 },
          { name: 'Electricity', count: 27 },
        ]
      };

      setHeatmapData(mockHeatmapData);
      setKpiData(mockKpiData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto mt-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* KPI Cards */}
      {kpiData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-blue-600">Total Complaints</h3>
            <p className="text-3xl font-bold mt-2">{kpiData.totalComplaints}</p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-green-600">Resolved Ratio</h3>
            <p className="text-3xl font-bold mt-2">{(kpiData.resolvedRatio * 100).toFixed(1)}%</p>
            <p className="text-sm text-gray-500 mt-1">Resolution rate</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-yellow-600">Unresolved</h3>
            <p className="text-3xl font-bold mt-2">{Math.round(kpiData.totalComplaints * (1 - kpiData.resolvedRatio))}</p>
            <p className="text-sm text-gray-500 mt-1">Pending action</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-purple-600">Avg Resolution</h3>
            <p className="text-3xl font-bold mt-2">
              {heatmapData.length > 0 
                ? (heatmapData.reduce((sum, ward) => sum + ward.avgResolutionTime, 0) / heatmapData.length).toFixed(1)
                : '0'
              }h
            </p>
            <p className="text-sm text-gray-500 mt-1">Hours</p>
          </div>
        </div>
      )}

      {/* Heatmap Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Complaint Heatmap by Ward</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Placeholder - Replace with actual Leaflet map */}
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-gray-600">Interactive Map</p>
              <p className="text-sm text-gray-500">Leaflet heatmap will be rendered here</p>
            </div>
          </div>
          
          {/* Ward Statistics */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">Ward Statistics</h4>
            {heatmapData.map((ward) => (
              <div key={ward.wardId} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">{ward.wardName}</h5>
                  <span className="text-sm text-gray-500">Ward {ward.wardId}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-semibold">{ward.totalComplaints}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Unresolved</p>
                    <p className="font-semibold text-red-600">{ward.unresolvedComplaints}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Avg Time</p>
                    <p className="font-semibold">{ward.avgResolutionTime}h</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${((ward.totalComplaints - ward.unresolvedComplaints) / ward.totalComplaints) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {((ward.totalComplaints - ward.unresolvedComplaints) / ward.totalComplaints * 100).toFixed(1)}% resolved
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Departments */}
      {kpiData && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Top Departments by Complaint Volume</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.topDepartments.map((dept, index) => (
              <div key={dept.name} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">#{index + 1}</div>
                <h4 className="font-semibold">{dept.name}</h4>
                <p className="text-2xl font-bold mt-2">{dept.count}</p>
                <p className="text-sm text-gray-500">complaints</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
