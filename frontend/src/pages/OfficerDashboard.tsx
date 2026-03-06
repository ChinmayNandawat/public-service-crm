import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Complaint } from '../services/api';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const [assignedComplaints, setAssignedComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  const fetchAssignedComplaints = async () => {
    try {
      setIsLoading(true);
      // Mock data - replace with actual API call when available
      const mockComplaints: Complaint[] = [
        {
          id: 1,
          category: 'Water Supply',
          description: 'Low water pressure affecting 50+ households in Sector 12',
          status: 'in_progress',
          priorityScore: 0.9,
          sentiment: 'neutral',
          createdAt: '2024-03-15T10:30:00Z',
          assignedAt: '2024-03-15T11:00:00Z',
          location: 'Sector 12, Residential Area',
          wardId: 1,
          departmentId: 1,
          assignedOfficer: user?.id,
          citizenId: 1
        },
        {
          id: 2,
          category: 'Street Light',
          description: 'Multiple lights not working on Main Road causing safety concerns',
          status: 'submitted',
          priorityScore: 0.7,
          sentiment: 'angry',
          createdAt: '2024-03-14T09:15:00Z',
          assignedAt: '2024-03-14T10:30:00Z',
          location: 'Main Road, Commercial Area',
          wardId: 2,
          departmentId: 2,
          assignedOfficer: user?.id,
          citizenId: 2
        },
        {
          id: 3,
          category: 'Sanitation',
          description: 'Garbage collection delayed for past 3 days in residential complex',
          status: 'in_progress',
          priorityScore: 0.8,
          sentiment: 'angry',
          createdAt: '2024-03-13T14:20:00Z',
          assignedAt: '2024-03-13T15:00:00Z',
          location: 'Green Valley Apartments',
          wardId: 3,
          departmentId: 3,
          assignedOfficer: user?.id,
          citizenId: 3
        }
      ];

      // Sort by priorityScore descending
      const sortedComplaints = mockComplaints.sort((a, b) => b.priorityScore - a.priorityScore);
      setAssignedComplaints(sortedComplaints);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch assigned complaints');
    } finally {
      setIsLoading(false);
    }
  };

  const updateComplaintStatus = async (complaintId: number, newStatus: string) => {
    try {
      setUpdatingId(complaintId);
      
      // Mock API call - replace with actual API call when available
      // await complaintsAPI.update(complaintId, { status: newStatus });
      
      // Update local state
      setAssignedComplaints(prev => 
        prev.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, status: newStatus as any, resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : undefined }
            : complaint
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update complaint status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Assigned';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  const getPriorityColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const assignedCount = assignedComplaints.length;
  const resolvedCount = assignedComplaints.filter(c => c.status === 'resolved').length;
  const inProgressCount = assignedComplaints.filter(c => c.status === 'in_progress').length;

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center mb-8">Officer Dashboard</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-blue-600">Assigned to Me</h3>
          <p className="text-3xl font-bold mt-2">{assignedCount}</p>
          <p className="text-sm text-gray-500 mt-1">Active complaints</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-yellow-600">In Progress</h3>
          <p className="text-3xl font-bold mt-2">{inProgressCount}</p>
          <p className="text-sm text-gray-500 mt-1">Currently working on</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-green-600">Resolved</h3>
          <p className="text-3xl font-bold mt-2">{resolvedCount}</p>
          <p className="text-sm text-gray-500 mt-1">Successfully closed</p>
        </div>
      </div>
      
      {/* Assigned Complaints */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">My Assigned Complaints</h3>
        {assignedComplaints.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No complaints assigned to you</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedComplaints.map((complaint) => (
              <div key={complaint.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{complaint.category}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {getStatusText(complaint.status)}
                      </span>
                      <span className={`text-sm font-medium ${getPriorityColor(complaint.priorityScore)}`}>
                        Priority: {(complaint.priorityScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{complaint.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>ID: #{complaint.id}</span>
                      {complaint.location && <span>📍 {complaint.location}</span>}
                      <span>Assigned: {formatDate(complaint.assignedAt!)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    {complaint.status === 'submitted' && (
                      <button
                        onClick={() => updateComplaintStatus(complaint.id, 'in_progress')}
                        disabled={updatingId === complaint.id}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingId === complaint.id ? 'Updating...' : 'Start Work'}
                      </button>
                    )}
                    
                    {complaint.status === 'in_progress' && (
                      <button
                        onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                        disabled={updatingId === complaint.id}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingId === complaint.id ? 'Updating...' : 'Mark Resolved'}
                      </button>
                    )}
                    
                    {complaint.status === 'resolved' && (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded text-sm">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;
