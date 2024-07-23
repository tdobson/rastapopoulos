'use client'

// components/ElevationTable/ElevationTable.tsx
import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
    MRT_EditActionButtons, MantineReactTable, useMantineReactTable,
    type MRT_ColumnDef,
    type MRT_SortingState,
    type MRT_RowVirtualizer, MRT_Row, MRT_TableInstance, MRT_TableOptions
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
    const [selectedElevation, setSelectedElevation] = useState<Elevation | null>(null);
    const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof Elevation, string>>>({});

    const columns = useMemo(
        () => [
            {
                accessorKey: 'plot_id',
                header: 'Plot ID',
                enableEditing: false,
                size: 80,
            },
            {
                accessorKey: 'Job Code',
                header: 'Job Code',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.['Job Code'],
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            'Job Code': undefined,
                        }),
                },
            },
            {
                accessorKey: 'plot_number',
                header: 'Plot Number',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.plot_number,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            plot_number: undefined,
                        }),
                },
            },
            {
                accessorKey: 'housetype',
                header: 'House Type',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.housetype,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            housetype: undefined,
                        }),
                },
            },
            {
                accessorKey: 'house_no',
                header: 'House No',
                mantineEditTextInputProps: {
                    error: validationErrors?.house_no,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            house_no: undefined,
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
                    error: validationErrors?.panel,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            panel: undefined,
                        }),
                },
            },
            {
                accessorKey: 'panelkwp',
                header: 'Panel KWp',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.panelkwp,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            panelkwp: undefined,
                        }),
                },
            },
            {
                accessorKey: 'mcscode',
                header: 'MCS Code',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.mcscode,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            mcscode: undefined,
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
                accessorKey: 'totalstrings',
                header: 'Total Strings',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.totalstrings,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            totalstrings: undefined,
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
                accessorKey: 'trackerstringno',
                header: 'Tracker String No',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.trackerstringno,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            trackerstringno: undefined,
                        }),
                },
            },
            {
                accessorKey: 'inverterhybrid',
                header: 'Inverter Hybrid',
                mantineEditTextInputProps: {
                    error: validationErrors?.inverterhybrid,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            inverterhybrid: undefined,
                        }),
                },
            },
            {
                accessorKey: 'typetestno',
                header: 'Type Test No',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.typetestno,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            typetestno: undefined,
                        }),
                },
            },
            {
                accessorKey: 'ratedoutputpower',
                header: 'Rated Output Power',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.ratedoutputpower,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            ratedoutputpower: undefined,
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
                accessorKey: 'mountingkit',
                header: 'Mounting Kit',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.mountingkit,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            mountingkit: undefined,
                        }),
                },
            },
            {
                accessorKey: 'tiletype',
                header: 'Tile Type',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.tiletype,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            tiletype: undefined,
                        }),
                },
            },
            {
                accessorKey: 'roofincline',
                header: 'Roof Incline',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.roofincline,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            roofincline: undefined,
                        }),
                },
            },
            {
                accessorKey: 'variationfromsouth',
                header: 'Variation From South',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.variationfromsouth,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            variationfromsouth: undefined,
                        }),
                },
            },
            {
                accessorKey: 'kwhperkwp',
                header: 'KWh/KWp',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.kwhperkwp,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            kwhperkwp: undefined,
                        }),
                },
            },
            {
                accessorKey: 'inaboveroof',
                header: 'In Above Roof',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.inaboveroof,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            inaboveroof: undefined,
                        }),
                },
            },
            {
                accessorKey: 'overshadingfactor',
                header: 'Overshadowing Factor',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.overshadingfactor,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            overshadingfactor: undefined,
                        }),
                },
            },
            {
                accessorKey: 'nopanels',
                header: 'No. of Panels',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.nopanels,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            nopanels: undefined,
                        }),
                },
            },
            {
                accessorKey: 'arraym2',
                header: 'Array M2',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.arraym2,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            arraym2: undefined,
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
                accessorKey: 'co2equivalent',
                header: 'CO2 Equivalent',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.co2equivalent,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            co2equivalent: undefined,
                        }),
                },
            },
            {
                accessorKey: 'netkwp',
                header: 'Net KWp',
                mantineEditTextInputProps: {
                    type: 'number',
                    error: validationErrors?.netkwp,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            netkwp: undefined,
                        }),
                },
            },
            {
                accessorKey: 'metermake',
                header: 'Meter Make',
                mantineEditTextInputProps: {
                type: 'number',
                required: true,error: validationErrors?.metermake,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            metermake: undefined,
                        }),
                },
            },
            {
                accessorKey: 'metermodel',
                header: 'Meter Model',
                mantineEditTextInputProps: {
                    error: validationErrors?.metermodel,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            metermodel: undefined,
                        }),
                },
            },
            {
                accessorKey: 'totalcost',
                header: 'Total Cost',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.totalcost,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            totalcost: undefined,
                        }),
                },
            },
            {
                accessorKey: 'totalprice',
                header: 'Total Price',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.totalprice,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            totalprice: undefined,
                        }),
                },
            },
            {
                accessorKey: 'givenergy',
                header: 'Given Energy',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.givenergy,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            givenergy: undefined,
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


    useEffect(() => {
        if (typeof window !== 'undefined') {

            setIsLoading(false);
        }
    }, []);



    //optionally access the underlying virtualizer instance
    const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<MRT_SortingState>([]);

    const table = useMantineReactTable({
        columns,
        data: elevations,
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        enableColumnVirtualization: true,
        enableRowVirtualization: false, //enable row virtualization
        enableGlobalFilterModes: true,
        enablePagination: true,
        onSortingChange: setSorting,
        state: { isLoading, sorting },
        rowVirtualizerInstanceRef, //optional
        rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
        columnVirtualizerOptions: { overscan: 2 }, //optionally customize the column virtualizer
        getRowId: (row) => row.plot_id,
        onCreatingRowSave: async ({ values }) => {
            await onCreateElevation(values as Elevation);
        },
        onEditingRowSave: async ({ exitEditingMode, values, row }) => {
            await onUpdateElevation(values as Elevation);
            exitEditingMode();
        },

        mantineTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                setSelectedElevation(row.original);
                onElevationSelect(row.original);
            },
            style: {
                cursor: 'pointer',
            },
        }),
        renderRowActions: ({ row }: { row: MRT_Row<Elevation> }) => (
            <Flex gap="md">
                <Tooltip label="Edit">
                    <ActionIcon onClick={() => table.setEditingRow(row)}>
                        <IconEdit />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => onDeleteElevation(row.original.plot_id)}>
                        <IconTrash />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Duplicate">
                    <ActionIcon color="yellow" onClick={() => onDeleteElevation(row.original.plot_id)}>
                        <IconShare />
                    </ActionIcon>
                </Tooltip>
            </Flex>
        ),
        renderTopToolbarCustomActions: ({ table }: { table: MRT_TableInstance<Elevation> }) => (
            <Button
                onClick={() => {
                    table.setCreatingRow(true);
                }}
            >
                Create New Elevation
            </Button>
        ),
} as MRT_TableOptions<Elevation>);
    return (
        <div>
            <MantineReactTable table={table}   />
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
