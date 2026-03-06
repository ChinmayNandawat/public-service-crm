import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SubmitComplaint from '../pages/SubmitComplaint';
import { AuthProvider } from '../hooks/useAuth';

// Mock the API
jest.mock('../services/api', () => ({
  complaintsAPI: {
    create: jest.fn(),
  },
  utilityAPI: {
    getWards: jest.fn().mockResolvedValue({
      data: [
        { id: 1, name: 'Ward 1', geojson: {} },
        { id: 2, name: 'Ward 2', geojson: {} }
      ]
    }),
    getDepartments: jest.fn().mockResolvedValue({
      data: [
        { id: 1, name: 'Water', slaHours: 24 },
        { id: 2, name: 'Roads', slaHours: 48 }
      ]
    })
  }
}));

// Mock React Router
const MockedSubmitComplaint = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SubmitComplaint />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('SubmitComplaint Form Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should show validation error when description is empty', async () => {
    render(<MockedSubmitComplaint />);
    
    // Try to submit form without filling required fields
    const submitButton = screen.getByText('Submit Complaint');
    fireEvent.click(submitButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  test('should show validation error when ward is not selected', async () => {
    render(<MockedSubmitComplaint />);
    
    // Fill description but not ward
    const descriptionTextarea = screen.getByPlaceholderText('Please describe your complaint in detail...');
    fireEvent.change(descriptionTextarea, { target: { value: 'Test complaint description' } });

    // Try to submit form
    const submitButton = screen.getByText('Submit Complaint');
    fireEvent.click(submitButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Ward is required')).toBeInTheDocument();
    });
  });

  test('should allow form submission when all required fields are filled', async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      data: { complaintId: 1, priorityScore: 0.8, message: 'Complaint submitted successfully!' }
    });
    
    // Mock the API call
    const { complaintsAPI } = require('../services/api');
    complaintsAPI.create.mockImplementation(mockCreate);

    render(<MockedSubmitComplaint />);
    
    // Fill required fields
    const descriptionTextarea = screen.getByPlaceholderText('Please describe your complaint in detail...');
    fireEvent.change(descriptionTextarea, { target: { value: 'Test complaint description' } });

    const wardSelect = screen.getByLabelText('Ward *');
    fireEvent.change(wardSelect, { target: { value: '1' } });

    // Submit form
    const submitButton = screen.getByText('Submit Complaint');
    fireEvent.click(submitButton);

    // Should call API with correct data
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        wardId: 1,
        departmentId: undefined,
        description: 'Test complaint description',
        location: undefined,
        latitude: undefined,
        longitude: undefined,
        attachment: undefined
      });
    });

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/Complaint submitted successfully!/)).toBeInTheDocument();
    });
  });

  test('should handle optional fields correctly', async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      data: { complaintId: 1, priorityScore: 0.8, message: 'Complaint submitted successfully!' }
    });
    
    const { complaintsAPI } = require('../services/api');
    complaintsAPI.create.mockImplementation(mockCreate);

    render(<MockedSubmitComplaint />);
    
    // Fill required fields
    const descriptionTextarea = screen.getByPlaceholderText('Please describe your complaint in detail...');
    fireEvent.change(descriptionTextarea, { target: { value: 'Test complaint description' } });

    const wardSelect = screen.getByLabelText('Ward *');
    fireEvent.change(wardSelect, { target: { value: '1' } });

    // Fill optional fields
    const locationInput = screen.getByPlaceholderText('Enter the address or location');
    fireEvent.change(locationInput, { target: { value: '123 Main St' } });

    const latitudeInput = screen.getByPlaceholderText('40.7128');
    fireEvent.change(latitudeInput, { target: { value: '40.7128' } });

    const longitudeInput = screen.getByPlaceholderText('-74.0060');
    fireEvent.change(longitudeInput, { target: { value: '-74.0060' } });

    // Submit form
    const submitButton = screen.getByText('Submit Complaint');
    fireEvent.click(submitButton);

    // Should call API with all fields
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        wardId: 1,
        departmentId: undefined,
        description: 'Test complaint description',
        location: '123 Main St',
        latitude: 40.7128,
        longitude: -74.0060,
        attachment: undefined
      });
    });
  });

  test('should handle API errors gracefully', async () => {
    const mockCreate = jest.fn().mockRejectedValue({
      response: { data: { error: 'Server error' } }
    });
    
    const { complaintsAPI } = require('../services/api');
    complaintsAPI.create.mockImplementation(mockCreate);

    render(<MockedSubmitComplaint />);
    
    // Fill required fields
    const descriptionTextarea = screen.getByPlaceholderText('Please describe your complaint in detail...');
    fireEvent.change(descriptionTextarea, { target: { value: 'Test complaint description' } });

    const wardSelect = screen.getByLabelText('Ward *');
    fireEvent.change(wardSelect, { target: { value: '1' } });

    // Submit form
    const submitButton = screen.getByText('Submit Complaint');
    fireEvent.click(submitButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });
});
