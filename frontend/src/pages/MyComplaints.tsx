import { useState, useEffect } from 'react';
import { complaintsAPI } from '../services/api';
import { Complaint } from '../services/api';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await complaintsAPI.getAll();
      setComplaints(response.data.complaints);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch complaints');
    } finally {
      setIsLoading(false);
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
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      case 'closed':
        return 'Closed';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto mt-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Complaints</h2>
        <button
          onClick={() => window.location.href = '/submit-complaint'}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit New Complaint
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {complaints.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No complaints found</p>
          <button
            onClick={() => window.location.href = '/submit-complaint'}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Your First Complaint
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => openModal(complaint)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{complaint.category}</h3>
                  <p className="text-gray-600 mt-1 line-clamp-2">{complaint.description}</p>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                    <span>Priority: {complaint.priorityScore}</span>
                    <span>Submitted: {formatDate(complaint.createdAt)}</span>
                    {complaint.assignedAt && (
                      <span>Assigned: {formatDate(complaint.assignedAt)}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(complaint.status)}`}>
                    {getStatusText(complaint.status)}
                  </span>
                  <div className="text-sm text-gray-500">
                    {complaint.location && <span>{complaint.location}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for complaint details */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedComplaint.category}</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Description</h4>
                  <p className="text-gray-600 mt-1">{selectedComplaint.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">Priority Score</h4>
                  <div className="flex items-center mt-1">
                    <div className={`w-full bg-gray-200 rounded-full h-2 mr-2`}>
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${selectedComplaint.priorityScore * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{selectedComplaint.priorityScore}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">Status</h4>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedComplaint.status)}`}>
                    {getStatusText(selectedComplaint.status)}
                  </span>
                </div>

                {selectedComplaint.location && (
                  <div>
                    <h4 className="font-semibold text-gray-700">Location</h4>
                    <p className="text-gray-600 mt-1">{selectedComplaint.location}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-700">Timeline</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Submitted</p>
                        <p className="text-xs text-gray-500">{formatDate(selectedComplaint.createdAt)}</p>
                      </div>
                    </div>
                    {selectedComplaint.assignedAt && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-600 rounded-full mr-3"></div>
                        <div>
                          <p className="text-sm font-medium">Assigned</p>
                          <p className="text-xs text-gray-500">{formatDate(selectedComplaint.assignedAt)}</p>
                        </div>
                      </div>
                    )}
                    {selectedComplaint.resolvedAt && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                        <div>
                          <p className="text-sm font-medium">Resolved</p>
                          <p className="text-xs text-gray-500">{formatDate(selectedComplaint.resolvedAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
