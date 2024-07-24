// elevationsService.ts
import { Elevation } from '../types/elevation';
import { elevationsApi } from '../utils/api';

const elevationsService = {
  // GET Elevations Report
  getElevationsReport: (): Promise<Elevation[]> => {
    return elevationsApi.getElevationsReport();
  },

  // GET Elevations
  getElevations: (): Promise<Elevation[]> => {
    return elevationsApi.getElevations();
  },

  // CREATE Elevation
  createElevation: (newElevation: Partial<Elevation>): Promise<Elevation> => {
    return elevationsApi.createElevation(newElevation);
  },

  // UPDATE Elevation
  updateElevation: (updatedElevation: Elevation): Promise<Elevation> => {
    return elevationsApi.updateElevation(updatedElevation);
  },

  // DELETE Elevation
  deleteElevation: (elevationId: string): Promise<void> => {
    return elevationsApi.deleteElevation(elevationId);
  },
};

export default elevationsService;
