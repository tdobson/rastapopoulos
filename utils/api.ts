// utils/api.ts
import { notifications } from '@mantine/notifications';
import { Elevation } from '../types/elevation';

// Define the API base URL
const apiBaseUrl = 'http://localhost:3001/api/v1';

// Define the API request function
async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, options);
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || 'An error occurred while making the request';
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle common error cases, e.g., network errors, unauthorized requests
    if (error instanceof Error) {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    }
    throw error;
  }
}

// Define API service functions
export const elevationsApi = {
  getElevationsReport: (): Promise<any[]> => {
    return apiRequest<any[]>('/elevations');
  },
  getElevations: (): Promise<Elevation[]> => {
    return apiRequest<Elevation[]>('/elevations');
  },
  createElevation: (newElevation: Partial<Elevation>): Promise<Elevation> => {
    return apiRequest<Elevation>('/elevations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newElevation),
    });
  },
  updateElevation: (updatedElevation: Elevation): Promise<Elevation> => {
    return apiRequest<Elevation>(`/elevations/${updatedElevation.plot_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedElevation),
    });
  },
  deleteElevation: (elevationId: string): Promise<void> => {
    return apiRequest<void>(`/elevations/${elevationId}`, {
      method: 'DELETE',
    });
  },
};
