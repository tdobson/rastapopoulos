// useElevations.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { elevationsApi } from '../utils/api';
import { Elevation } from '../types/elevation';
import { notifications } from "@mantine/notifications";

// Define the key for the Elevations query
const ELEVATIONS_QUERY_KEY = 'elevations';
const ELEVATION_REPORTS_QUERY_KEY = 'elevationReports';

// Custom hook for managing Elevations data
export const useElevations = () => {
    const queryClient = useQueryClient();

    // GET Elevations
    const { data: elevations, isLoading, isError, error } = useQuery<Elevation[], Error>({
        queryKey: [ELEVATIONS_QUERY_KEY],
        queryFn: elevationsApi.getElevations
    });

    // GET Elevation Reports
    const {
        data: elevationReports,
        isLoading: isLoadingElevationReports,
        isError: isErrorElevationReports,
        error: errorElevationReports,
    } = useQuery<Elevation[], Error>({
        queryKey: [ELEVATION_REPORTS_QUERY_KEY],
        queryFn: elevationsApi.getElevationsReport,
    });

    // Handle error logging separately
    if (isErrorElevationReports) {
        console.error('Error fetching elevation reports:', errorElevationReports);
    }

    // CREATE Elevation
    const { mutateAsync: createElevation, isPending: isCreatingElevation } = useMutation({
        mutationFn: (newElevation: Partial<Elevation>) => elevationsApi.createElevation(newElevation),
        onSuccess: (newElevation) => {
            queryClient.setQueryData<Elevation[]>([ELEVATIONS_QUERY_KEY], (old = []) => [...old, newElevation]);
        },
        onError: (err) => {
            notifications.show({
                title: 'Error',
                message: 'Failed to create elevation',
                color: 'red',
            });
        },
    });

    // UPDATE Elevation
    const { mutateAsync: updateElevation, isPending: isUpdatingElevation } = useMutation({
        mutationFn: (updatedElevation: Elevation) => elevationsApi.updateElevation(updatedElevation),
        onSuccess: (updatedElevation) => {
            queryClient.setQueryData<Elevation[]>([ELEVATIONS_QUERY_KEY], (old = []) =>
                old.map((elevation) => (elevation.plot_id === updatedElevation.plot_id ? updatedElevation : elevation))
            );
        },
        onError: (err) => {
            notifications.show({
                title: 'Error',
                message: 'Failed to update elevation',
                color: 'red',
            });
        },
    });

    // DELETE Elevation
    const { mutateAsync: deleteElevation, isPending: isDeletingElevation } = useMutation({
        mutationFn: (elevationId: string) => elevationsApi.deleteElevation(elevationId),
        onSuccess: (_, elevationId) => {
            queryClient.setQueryData<Elevation[]>([ELEVATIONS_QUERY_KEY], (old = []) =>
                old.filter((elevation) => elevation.id !== elevationId)
            );
        },
        onError: (err) => {
            notifications.show({
                title: 'Error',
                message: 'Failed to delete elevation',
                color: 'red',
            });
        },
    });

    return {
        elevations,
        isLoading,
        isError,
        error,
        elevationReports,
        isLoadingElevationReports,
        isErrorElevationReports,
        errorElevationReports,
        createElevation,
        isCreatingElevation,
        updateElevation,
        isUpdatingElevation,
        deleteElevation,
        isDeletingElevation,
    };
};
