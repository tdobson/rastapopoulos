'use client'


// ElevationTable.tsx
import React, { useMemo, useState } from 'react';
import {
    MRT_EditActionButtons,
    MantineReactTable,
    useMantineReactTable,
} from 'mantine-react-table';
import { ActionIcon, Button, Flex, Stack, Text, Title, Tooltip, Menu, Divider } from '@mantine/core';
import { IconEdit, IconTrash, IconShare, IconUser, IconDots } from '@tabler/icons-react';
import { Elevation } from '../../types/elevation';
import { ElevationDetails } from '../ElevationDetails/ElevationDetails';

interface ElevationTableProps {
    elevations: Elevation[];
    onElevationSelect: (elevation: Elevation) => void;
    onCreateElevation: (newElevation: Partial<Elevation>) => Promise<void>;
    onUpdateElevation: (updatedElevation: Elevation) => Promise<void>;
    onDeleteElevation: (elevationId: string) => Promise<void>;
}

const ElevationTable: React.FC<ElevationTableProps> = ({
                                                           elevations,
                                                           onElevationSelect,
                                                           onCreateElevation,
                                                           onUpdateElevation,
                                                           onDeleteElevation,
                                                       }) => {
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedElevation, setSelectedElevation] = useState<Elevation | null>(null);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                enableEditing: false,
                size: 80,
            },
            {
                accessorKey: 'plotId',
                header: 'Plot ID',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.plotId,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            plotId: undefined,
                        }),
                },
            },
            {
                accessorKey: 'jobCode',
                header: 'Job Code',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.jobCode,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            jobCode: undefined,
                        }),
                },
            },
            {
                accessorKey: 'plotNumber',
                header: 'Plot Number',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.plotNumber,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            plotNumber: undefined,
                        }),
                },
            },
            {
                accessorKey: 'houseType',
                header: 'House Type',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.houseType,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            houseType: undefined,
                        }),
                },
            },
            {
                accessorKey: 'houseNo',
                header: 'House No',
                mantineEditTextInputProps: {
                    error: validationErrors?.houseNo,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            houseNo: undefined,
                        }),
                },
            },
            {
                accessorKey: 'street',
                header: 'Street',
                mantineEditTextInputProps: {
                    error: validationErrors?.street,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            street: undefined,
                        }),
                },
            },
            {
                accessorKey: 'town',
                header: 'Town',
                mantineEditTextInputProps: {
                    error: validationErrors?.town,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            town: undefined,
                        }),
                },
            },
            {
                accessorKey: 'postcode',
                header: 'Postcode',
                mantineEditTextInputProps: {
                    error: validationErrors?.postcode,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            postcode: undefined,
                        }),
                },
            },
            {
                accessorKey: 'mpan',
                header: 'MPAN',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.mpan,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            mpan: undefined,
                        }),
                },
            },
            {
                accessorKey: 'panel',
                header: 'Panel',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.panel,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            panel: undefined,
                        }),
                },
            },
            {
                accessorKey: 'panelKwp',
                header: 'Panel KWp',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.panelKwp,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            panelKwp: undefined,
                        }),
                },
            },
            {
                accessorKey: 'mcsCode',
                header: 'MCS Code',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.mcsCode,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            mcsCode: undefined,
                        }),
                },
            },
            {
                accessorKey: 'orientation',
                header: 'Orientation',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.orientation,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            orientation: undefined,
                        }),
                },
            },
            {
                accessorKey: 'columns',
                header: 'Columns',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.columns,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            columns: undefined,
                        }),
                },
            },
            {
                accessorKey: 'rows',
                header: 'Rows',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.rows,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            rows: undefined,
                        }),
                },
            },
            {
                accessorKey: 'phase',
                header: 'Phase',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.phase,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            phase: undefined,
                        }),
                },
            },
            {
                accessorKey: 'totalStrings',
                header: 'Total Strings',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.totalStrings,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            totalStrings: undefined,
                        }),
                },
            },
            {
                accessorKey: 'string1',
                header: 'String 1',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.string1,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            string1: undefined,
                        }),
                },
            },
            {
                accessorKey: 'string2',
                header: 'String 2',
                mantineEditTextInputProps: {
                    error: validationErrors?.string2,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            string2: undefined,
                        }),
                },
            },
            {
                accessorKey: 'string3',
                header: 'String 3',
                mantineEditTextInputProps: {
                    error: validationErrors?.string3,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            string3: undefined,
                        }),
                },
            },
            {
                accessorKey: 'string4',
                header: 'String 4',
                mantineEditTextInputProps: {
                    error: validationErrors?.string4,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            string4: undefined,
                        }),
                },
            },
            {
                accessorKey: 'inverter',
                header: 'Inverter',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.inverter,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            inverter: undefined,
                        }),
                },
            },
            {
                accessorKey: 'trackerStringNo',
                header: 'Tracker String No',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.trackerStringNo,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            trackerStringNo: undefined,
                        }),
                },
            },
            {
                accessorKey: 'inverterHybrid',
                header: 'Inverter Hybrid',
                mantineEditTextInputProps: {
                    error: validationErrors?.inverterHybrid,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            inverterHybrid: undefined,
                        }),
                },
            },
            {
                accessorKey: 'typeTestNo',
                header: 'Type Test No',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.typeTestNo,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            typeTestNo: undefined,
                        }),
                },
            },
            {
                accessorKey: 'ratedOutputPower',
                header: 'Rated Output Power',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.ratedOutputPower,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            ratedOutputPower: undefined,
                        }),
                },
            },
            {
                accessorKey: 'battery',
                header: 'Battery',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.battery,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            battery: undefined,
                        }),
                },
            },
            {
                accessorKey: 'mountingKit',
                header: 'Mounting Kit',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.mountingKit,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            mountingKit: undefined,
                        }),
                },
            },
            {
                accessorKey: 'tileType',
                header: 'Tile Type',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.tileType,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            tileType: undefined,
                        }),
                },
            },
            {
                accessorKey: 'roofIncline',
                header: 'Roof Incline',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.roofIncline,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            roofIncline: undefined,
                        }),
                },
            },
            {
                accessorKey: 'variationFromSouth',
                header: 'Variation From South',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.variationFromSouth,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            variationFromSouth: undefined,
                        }),
                },
            },
            {
                accessorKey: 'kwhPerKwp',
                header: 'KWh/KWp',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.kwhPerKwp,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            kwhPerKwp: undefined,
                        }),
                },
            },
            {
                accessorKey: 'inAboveRoof',
                header: 'In Above Roof',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.inAboveRoof,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            inAboveRoof: undefined,
                        }),
                },
            },
            {
                accessorKey: 'overshadingFactor',
                header: 'Overshadowing Factor',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.overshadingFactor,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            overshadingFactor: undefined,
                        }),
                },
            },
            {
                accessorKey: 'noPanels',
                header: 'No. of Panels',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.noPanels,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            noPanels: undefined,
                        }),
                },
            },
            {
                accessorKey: 'arrayM2',
                header: 'Array M2',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.arrayM2,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            arrayM2: undefined,
                        }),
                },
            },
            {
                accessorKey: 'kwp',
                header: 'KWp',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.kwp,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            kwp: undefined,
                        }),
                },
            },
            {
                accessorKey: 'kwh',
                header: 'KWh',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.kwh,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            kwh: undefined,
                        }),
                },
            },
            {
                accessorKey: 'co2Equivalent',
                header: 'CO2 Equivalent',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.co2Equivalent,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            co2Equivalent: undefined,
                        }),
                },
            },
            {

                accessorKey: 'netKwp',
                header: 'Net KWp',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.netKwp,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            netKwp: undefined,
                        }),
                },
            },
            {
                accessorKey: 'meterMake',
                header: 'Meter Make',
                mantineEditTextInputProps: {
                    error: validationErrors?.meterMake,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            meterMake: undefined,
                        }),
                },
            },
            {
                accessorKey: 'meterModel',
                header: 'Meter Model',
                mantineEditTextInputProps: {
                    error: validationErrors?.meterModel,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            meterModel: undefined,
                        }),
                },
            },
            {
                accessorKey: 'totalCost',
                header: 'Total Cost',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.totalCost,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            totalCost: undefined,
                        }),
                },
            },
            {
                accessorKey: 'totalPrice',
                header: 'Total Price',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.totalPrice,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            totalPrice: undefined,
                        }),
                },
            },
            {
                accessorKey: 'givenEnergy',
                header: 'Given Energy',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.givenEnergy,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            givenEnergy: undefined,
                        }),
                },
            },
            {
                accessorKey: 'instanceId',
                header: 'Instance ID',
                enableEditing: false,
            },
        ],
        [validationErrors]
    );

    const table = useMantineReactTable({
        columns,
        data: elevations,
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        getRowId: (row) => row.id,
        onCreatingRowSave: async (_, newElevation) => {
            await onCreateElevation(newElevation);
        },
        onEditingRowSave: async (_, updatedElevation) => {
            await onUpdateElevation(updatedElevation);
        },
        onRowClick: (row) => {
            setSelectedElevation(row.original);
            onElevationSelect(row.original);
        },
        renderRowActions: ({ row }) => (
            <Flex gap="md">
                <Tooltip label="Edit">
                    <ActionIcon onClick={() => table.setEditingRow(row)}>
                        <IconEdit />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => onDeleteElevation(row.original.id)}>
                        <IconTrash />
                    </ActionIcon>
                </Tooltip>
            </Flex>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                onClick={() => {
                    table.setCreatingRow(true);
                }}
            >
                Create New Elevation
            </Button>
        ),
    });

    return (
        <div>
               <MantineReactTable table={table} />
            {selectedElevation && (
                <ElevationDetails
                    elevation={selectedElevation}
                    onUpdateElevation={onUpdateElevation}
                    onDeleteElevation={onDeleteElevation}
                />
            )}
        </div>
    );
};

    export { ElevationTable };
