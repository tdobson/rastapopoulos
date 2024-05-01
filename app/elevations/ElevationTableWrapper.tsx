// elevations/ElevationTableWrapper.tsx (Client Component)
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ElevationTable } from '../../components/ElevationTable/ElevationTable';
import { ElevationDetails } from '../../components/ElevationDetails/ElevationDetails';
import { Elevation } from '../../types/elevation';
import { elevationsApi } from '../../utils/api';

export const ElevationTableWrapper: React.FC = () => {
    const [selectedElevation, setSelectedElevation] = useState<Elevation | null>(null);
    const queryClient = useQueryClient();

    const { data: elevations = [], isLoading, isError } = useQuery<Elevation[]>({
        queryKey: ['elevations'],
        queryFn: elevationsApi.getElevations,
    });

    const createMutation = useMutation({
        mutationFn: elevationsApi.createElevation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['elevations'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: elevationsApi.updateElevation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['elevations'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: elevationsApi.deleteElevation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['elevations'] });
        },
    });

    const handleElevationSelect = (elevation: Elevation) => {
        setSelectedElevation(elevation);
    };

    const handleCreateElevation = async (newElevation: Partial<Elevation>) => {
        await createMutation.mutateAsync(newElevation);
    };

    const handleUpdateElevation = async (updatedElevation: Elevation) => {
        await updateMutation.mutateAsync(updatedElevation);
    };

    const handleDeleteElevation = async (elevationId: string) => {
        await deleteMutation.mutateAsync(elevationId);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error occurred while fetching elevations.</div>;
    }

    return (
        <>
            <ElevationTable
                elevations={elevations}
                onElevationSelect={handleElevationSelect}
                onCreateElevation={handleCreateElevation}
                onUpdateElevation={handleUpdateElevation}
                onDeleteElevation={handleDeleteElevation}
            />
            {selectedElevation && (
                <ElevationDetails
                    elevation={selectedElevation}
                    onUpdateElevation={handleUpdateElevation}
                    onDeleteElevation={handleDeleteElevation}
                />
            )}
        </>
    );
};
