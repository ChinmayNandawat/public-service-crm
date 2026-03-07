import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintsAPI, utilityAPI } from '../services/api';
import { Ward, Department } from '../services/api';
import { offlineDraftService } from '../services/offlineDraftService';
import { offlineSyncService } from '../services/offlineSyncService';

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);

  useEffect(() => {
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
        setError('Failed to load wards and departments. Please refresh the page.');
      }
    };

    // Load any existing draft
    const loadDraft = async () => {
      try {
        const drafts = await offlineDraftService.getAllDrafts();
        if (drafts.length > 0) {
          const latestDraft = drafts[0]; // Get the most recent draft
          setDescription(latestDraft.description);
          setWardId(latestDraft.wardId?.toString() || '');
          setDepartmentId(latestDraft.departmentId?.toString() || '');
          setLocation(latestDraft.location);
          setDraftId(latestDraft.id || null);
          setLastSaved(latestDraft.updatedAt);
        }
      } catch (err) {
        console.error('Error loading draft:', err);
      }
    };

    fetchData();
    loadDraft();

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-save draft every 10 seconds
  useEffect(() => {
    if (!description.trim() && !wardId) return;

    const saveDraft = async () => {
      try {
        setIsDrafting(true);
        const draftData = {
          description: description.trim(),
          location: location.trim(),
          category: 'General', // Default category
          priorityScore: 0.5, // Default priority
          wardId: wardId ? parseInt(wardId) : undefined,
          departmentId: departmentId ? parseInt(departmentId) : undefined,
        };

        const id = await offlineDraftService.saveDraft(draftData);
        setDraftId(id);
        setLastSaved(new Date().toISOString());
        console.log('Draft auto-saved:', id);
      } catch (err) {
        console.error('Error auto-saving draft:', err);
      } finally {
        setIsDrafting(false);
      }
    };

    const interval = setInterval(saveDraft, 10000);
    return () => clearInterval(interval);
  }, [description, wardId, departmentId, location]);

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

      if (isOnline) {
        // Try to submit immediately if online
        const response = await complaintsAPI.create(complaintData);
        const { priorityScore } = response.data;

        setSuccess(`Complaint submitted successfully! Priority Score: ${priorityScore}`);
        
        // Clear draft after successful submission
        if (draftId) {
          await offlineDraftService.deleteDraft(draftId);
        }
        
        // Reset form
        resetForm();

        // Redirect to complaints list after 2 seconds
        setTimeout(() => {
          navigate('/my-complaints');
        }, 2000);
      } else {
        // Save to outbox if offline
        await offlineSyncService.saveComplaintOffline({
          description: complaintData.description,
          location: complaintData.location,
          category: 'General',
          priorityScore: 0.5,
          wardId: complaintData.wardId,
          departmentId: complaintData.departmentId,
        });

        setSuccess('Complaint saved locally. It will be uploaded when you\'re back online.');
        
        // Clear draft after saving to outbox
        if (draftId) {
          await offlineDraftService.deleteDraft(draftId);
        }
        
        // Reset form
        resetForm();

        // Redirect to complaints list after 2 seconds
        setTimeout(() => {
          navigate('/my-complaints');
        }, 2000);
      }

    } catch (err: any) {
      // If online submission fails, save to outbox
      if (navigator.onLine) {
        try {
          await offlineSyncService.saveComplaintOffline({
            description: description.trim(),
            location: location.trim(),
            category: 'General',
            priorityScore: 0.5,
            wardId: parseInt(wardId),
            departmentId: departmentId ? parseInt(departmentId) : undefined,
          });

          setSuccess('Complaint saved locally due to network issues. It will be uploaded automatically.');
          
          // Clear draft after saving to outbox
          if (draftId) {
            await offlineDraftService.deleteDraft(draftId);
          }
          
          // Reset form
          resetForm();

          setTimeout(() => {
            navigate('/my-complaints');
          }, 2000);
        } catch (offlineErr) {
          setError('Failed to submit complaint both online and offline. Please try again.');
        }
      } else {
        setError(err.response?.data?.error || 'Failed to submit complaint. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setWardId('');
    setDepartmentId('');
    setLocation('');
    setLatitude('');
    setLongitude('');
    setAttachment(null);
    setDraftId(null);
    setLastSaved(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-start pt-12 px-4 pb-12">
      <div className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-slate-50 text-3xl font-bold">Submit Complaint</h2>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 border ${
              isOnline 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-orange-400'}`}></div>
              {isOnline ? 'Online' : 'Offline Mode'}
            </div>
          </div>
        </div>
        
        {(draftId || isDrafting) && (
          <div className={`mb-6 p-4 rounded-xl text-sm border flex items-center justify-between ${
            isDrafting 
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            <div className="flex items-center space-x-3">
              {isDrafting && (
                <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <span className="font-medium">
                {isDrafting ? 'Saving draft...' : 'Draft saved locally'}
              </span>
            </div>
            {lastSaved && !isDrafting && (
              <div className="text-xs opacity-75">
                Last saved: {new Date(lastSaved).toLocaleString()}
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-6 font-medium">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="ward" className="block text-slate-400 text-sm mb-1.5 font-medium">
              Ward *
            </label>
            <select
              id="ward"
              value={wardId}
              onChange={(e) => setWardId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all appearance-none"
              required
            >
              <option value="" className="bg-slate-900 text-slate-400">Select a ward</option>
              {wards.map((ward) => (
                <option key={ward.id} value={ward.id} className="bg-slate-900 text-slate-50">
                  {ward.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="department" className="block text-slate-400 text-sm mb-1.5 font-medium">
              Department (Optional)
            </label>
            <select
              id="department"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all appearance-none"
            >
              <option value="" className="bg-slate-900 text-slate-400">Select a department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id} className="bg-slate-900 text-slate-50">
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label htmlFor="description" className="block text-slate-400 text-sm mb-1.5 font-medium">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full bg-slate-950 border border-slate-700 text-slate-50 placeholder-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Please describe your complaint in detail..."
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label htmlFor="location" className="block text-slate-400 text-sm mb-1.5 font-medium">
              Address (Optional)
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-50 placeholder-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter the address or location"
            />
          </div>

          <div>
            <label htmlFor="latitude" className="block text-slate-400 text-sm mb-1.5 font-medium">
              Latitude (Optional)
            </label>
            <input
              type="number"
              id="latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              step="any"
              className="w-full bg-slate-950 border border-slate-700 text-slate-50 placeholder-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
              placeholder="40.7128"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-slate-400 text-sm mb-1.5 font-medium">
              Longitude (Optional)
            </label>
            <input
              type="number"
              id="longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              step="any"
              className="w-full bg-slate-950 border border-slate-700 text-slate-50 placeholder-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
              placeholder="-74.0060"
            />
          </div>

          <div className="col-span-1 md:col-span-2 mt-2">
            <label className="block text-slate-400 text-sm mb-1.5 font-medium">
              Attachment (Optional)
            </label>
            <label
              htmlFor="attachment"
              className="w-full border-2 border-dashed border-slate-700 hover:border-cyan-500 bg-slate-900/30 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-3 text-slate-500 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-slate-300">
                  <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
              </div>
              <input
                type="file"
                id="attachment"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
            </label>
            {attachment && (
              <div className="mt-3 flex items-center bg-slate-900 border border-slate-800 p-3 rounded-lg">
                <svg className="w-5 h-5 text-cyan-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-slate-300 font-medium truncate">
                  {attachment.name}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="col-span-1 md:col-span-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-4 rounded-xl mt-4 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Submit Complaint'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
