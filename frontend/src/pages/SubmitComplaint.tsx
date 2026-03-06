import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintsAPI, utilityAPI } from '../services/api';
import { Ward, Department } from '../services/api';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [wardId, setWardId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [wards, setWards] = useState<Ward[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  React.useEffect(() => {
    // Fetch wards and departments on component mount
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
        // Use mock data if API fails
        setWards([
          { id: 1, name: 'Ward 1', geojson: {} },
          { id: 2, name: 'Ward 2', geojson: {} },
          { id: 3, name: 'Ward 3', geojson: {} }
        ]);
        setDepartments([
          { id: 1, name: 'Water', slaHours: 24 },
          { id: 2, name: 'Roads', slaHours: 48 },
          { id: 3, name: 'Sanitation', slaHours: 12 }
        ]);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validate required fields
    if (!description.trim()) {
      setError('Description is required');
      setIsLoading(false);
      return;
    }

    if (!wardId) {
      setError('Ward is required');
      setIsLoading(false);
      return;
    }

    try {
      const complaintData = {
        wardId: parseInt(wardId),
        departmentId: departmentId ? parseInt(departmentId) : undefined,
        description: description.trim(),
        location: location.trim() || undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        attachment: attachment || undefined
      };

      const response = await complaintsAPI.create(complaintData);
      const { priorityScore } = response.data;

      setSuccess(`Complaint submitted successfully! Priority Score: ${priorityScore}`);
      
      // Reset form
      setDescription('');
      setWardId('');
      setDepartmentId('');
      setLocation('');
      setLatitude('');
      setLongitude('');
      setAttachment(null);

      // Redirect to complaints list after 2 seconds
      setTimeout(() => {
        navigate('/my-complaints');
      }, 2000);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Submit Complaint</h2>
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-2">
            Ward *
          </label>
          <select
            id="ward"
            value={wardId}
            onChange={(e) => setWardId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a ward</option>
            {wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
            Department (Optional)
          </label>
          <select
            id="department"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Please describe your complaint in detail..."
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Address (Optional)
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the address or location"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
              Latitude (Optional)
            </label>
            <input
              type="number"
              id="latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              step="any"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="40.7128"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
              Longitude (Optional)
            </label>
            <input
              type="number"
              id="longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              step="any"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="-74.0060"
            />
          </div>
        </div>

        <div>
          <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-2">
            Attachment (Optional)
          </label>
          <input
            type="file"
            id="attachment"
            onChange={handleFileChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            accept="image/*,.pdf,.doc,.docx"
          />
          {attachment && (
            <p className="mt-2 text-sm text-gray-500">
              Selected file: {attachment.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default SubmitComplaint;
