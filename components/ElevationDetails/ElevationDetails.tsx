// ElevationDetails.tsx
import React, { useState } from 'react';
import { ActionIcon, Box, Divider, Flex, Text, Title, Tooltip, Modal, Stack, TextInput, Button } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Elevation } from '../../types/elevation';

interface ElevationDetailsProps {
    elevation: Elevation;
    onUpdateElevation: (updatedElevation: Elevation) => Promise<void>;
    onDeleteElevation: (elevationId: string) => Promise<void>;
}

const ElevationDetails: React.FC<ElevationDetailsProps> = ({
                                                               elevation,
                                                               onUpdateElevation,
                                                               onDeleteElevation,
                                                           }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updatedElevation, setUpdatedElevation] = useState<Elevation>(elevation);

    const handleEditElevation = () => {
        setIsEditModalOpen(true);
    };

    const handleSaveEditedElevation = async () => {
        await onUpdateElevation(updatedElevation);
        setIsEditModalOpen(false);
    };

    const handleDeleteElevation = async () => {
        await onDeleteElevation(elevation.id);
    };

    const handleInputChange = (field: keyof Elevation, value: string | number) => {
        setUpdatedElevation((prevElevation) => ({
            ...prevElevation,
            [field]: value,
        }));
    };

    return (
        <Box mt={20}>
            <Flex justify="space-between" align="center">
                <Title order={2}>Elevation Details</Title>
                <Flex gap="md">
                    <Tooltip label="Edit">
                        <ActionIcon onClick={handleEditElevation}>
                            <IconEdit />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete">
                        <ActionIcon color="red" onClick={handleDeleteElevation}>
                            <IconTrash />
                        </ActionIcon>
                    </Tooltip>
                </Flex>
            </Flex>
            <Divider my="sm" />
            <Box>
                <Text>
                    <strong>Plot ID:</strong> {elevation.plotId}
                </Text>
                <Text>
                    <strong>Job Code:</strong> {elevation.jobCode}
                </Text>
                <Text>
                    <strong>Plot Number:</strong> {elevation.plotNumber}
                </Text>
                <Text>
                    <strong>House Type:</strong> {elevation.houseType}
                </Text>
                <Text>
                    <strong>House No:</strong> {elevation.houseNo || 'N/A'}
                </Text>
                <Text>
                    <strong>Street:</strong> {elevation.street || 'N/A'}
                </Text>
                <Text>
                    <strong>Town:</strong> {elevation.town || 'N/A'}
                </Text>
                <Text>
                    <strong>Postcode:</strong> {elevation.postcode || 'N/A'}
                </Text>
                <Text>
                    <strong>MPAN:</strong> {elevation.mpan}
                </Text>
                <Text>
                    <strong>Panel:</strong> {elevation.panel}
                </Text>
                <Text>
                    <strong>Panel KWp:</strong> {elevation.panelKwp}
                </Text>
                <Text>
                    <strong>MCS Code:</strong> {elevation.mcsCode}
                </Text>
                <Text>
                    <strong>Orientation:</strong> {elevation.orientation}
                </Text>
                <Text>
                    <strong>Columns:</strong> {elevation.columns}
                </Text>
                <Text>
                    <strong>Rows:</strong> {elevation.rows}
                </Text>
                <Text>
                    <strong>Phase:</strong> {elevation.phase}
                </Text>
                <Text>
                    <strong>Total Strings:</strong> {elevation.totalStrings}
                </Text>
                <Text>
                    <strong>String 1:</strong> {elevation.string1}
                </Text>
                <Text>
                    <strong>String 2:</strong> {elevation.string2 || 'N/A'}
                </Text>
                <Text>
                    <strong>String 3:</strong> {elevation.string3 || 'N/A'}
                </Text>
                <Text>
                    <strong>String 4:</strong> {elevation.string4 || 'N/A'}
                </Text>
                <Text>
                    <strong>Inverter:</strong> {elevation.inverter}
                </Text>
                <Text>
                    <strong>Tracker String No:</strong> {elevation.trackerStringNo}
                </Text>
                <Text>
                    <strong>Inverter Hybrid:</strong> {elevation.inverterHybrid || 'N/A'}
                </Text>
                <Text>
                    <strong>Type Test No:</strong> {elevation.typeTestNo}
                </Text>
                <Text>
                    <strong>Rated Output Power:</strong> {elevation.ratedOutputPower || 'N/A'}
                </Text>
                <Text>
                    <strong>Battery:</strong> {elevation.battery}
                </Text>
                <Text>
                    <strong>Mounting Kit:</strong> {elevation.mountingKit}
                </Text>
                <Text>
                    <strong>Tile Type:</strong> {elevation.tileType}
                </Text>
                <Text>
                    <strong>Roof Incline:</strong> {elevation.roofIncline}
                </Text>
                <Text>
                    <strong>Variation From South:</strong> {elevation.variationFromSouth}
                </Text>
                <Text>
                    <strong>KWh/KWp:</strong> {elevation.kwhPerKwp || 'N/A'}
                </Text>
                <Text>
                    <strong>In Above Roof:</strong> {elevation.inAboveRoof || 'N/A'}
                </Text>
                <Text>
                    <strong>Overshadowing Factor:</strong> {elevation.overshadingFactor || 'N/A'}
                </Text>
                <Text>
                    <strong>No. of Panels:</strong> {elevation.noPanels}
                </Text>
                <Text>
                    <strong>Array M2:</strong> {elevation.arrayM2 || 'N/A'}
                </Text>
                <Text>
                    <strong>KWp:</strong> {elevation.kwp}
                </Text>
                <Text>
                    <strong>KWh:</strong> {elevation.kwh || 'N/A'}
                </Text>
                <Text>
                    <strong>CO2 Equivalent:</strong> {elevation.co2Equivalent || 'N/A'}
                </Text>
                <Text>
                    <strong>Net KWp:</strong> {elevation.netKwp}
                </Text>
                <Text>
                    <strong>Meter Make:</strong> {elevation.meterMake || 'N/A'}
                </Text>
                <Text>
                    <strong>Meter Model:</strong> {elevation.meterModel || 'N/A'}
                </Text>
                <Text>
                    <strong>Total Cost:</strong> {elevation.totalCost}
                </Text>
                <Text>
                    <strong>Total Price:</strong> {elevation.totalPrice}
                </Text>
                <Text>
                    <strong>Given Energy:</strong> {elevation.givenEnergy}
                </Text>
                <Text>
                    <strong>Instance ID:</strong> {elevation.instanceId}
                </Text>
            </Box>

            <Modal
                opened={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Elevation"
            >
                <Stack>
                    <TextInput
                        label="Plot ID"
                        value={updatedElevation.plotId}
                        onChange={(e) => handleInputChange('plotId', e.target.value)}
                    />
                    <TextInput
                        label="Job Code"
                        value={updatedElevation.jobCode}
                        onChange={(e) => handleInputChange('jobCode', e.target.value)}
                    />
                    <TextInput
                        label="Plot Number"
                        value={updatedElevation.plotNumber}
                        onChange={(e) => handleInputChange('plotNumber', e.target.value)}
                    />
                    <TextInput
                        label="House Type"
                        value={updatedElevation.houseType}
                        onChange={(e) => handleInputChange('houseType', e.target.value)}
                    />
                    <TextInput
                        label="House No."
                        value={updatedElevation.houseNo || ''}
                        onChange={(e) => handleInputChange('houseNo', e.target.value)}
                    />
                    <TextInput
                        label="Street"
                        value={updatedElevation.street || ''}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                    />
                    <TextInput
                        label="Town"
                        value={updatedElevation.town || ''}
                        onChange={(e) => handleInputChange('town', e.target.value)}
                    />
                    <TextInput
                        label="Postcode"
                        value={updatedElevation.postcode || ''}
                        onChange={(e) => handleInputChange('postcode', e.target.value)}
                    />
                    <TextInput
                        label="MPAN"
                        value={updatedElevation.mpan}
                        onChange={(e) => handleInputChange('mpan', e.target.value)}
                    />
                    <TextInput
                        label="Panel"
                        value={updatedElevation.panel}
                        onChange={(e) => handleInputChange('panel', e.target.value)}
                    />
                    <TextInput
                        label="Panel KWp"
                        type="number"
                        value={updatedElevation.panelKwp}
                        onChange={(e) => handleInputChange('panelKwp', parseFloat(e.target.value))}
                    />
                    <TextInput
                        label="MCS Code"
                        value={updatedElevation.mcsCode}
                        onChange={(e) => handleInputChange('mcsCode', e.target.value)}
                    />
                    <TextInput
                        label="Orientation"
                        value={updatedElevation.orientation}
                        onChange={(e) => handleInputChange('orientation', e.target.value)}
                    />
                    <TextInput
                        label="Columns"
                        type="number"
                        value={updatedElevation.columns}
                        onChange={(e) => handleInputChange('columns', parseInt(e.target.value))}
                    />
                    <TextInput
                        label="Rows"
                        type="number"
                        value={updatedElevation.rows}
                        onChange={(e) => handleInputChange('rows', parseInt(e.target.value))}
                    />
                    <TextInput
                        label="Phase"
                        type="number"
                        value={updatedElevation.phase}
                        onChange={(e) => handleInputChange('phase', parseInt(e.target.value))}
                    />
                    <TextInput
                        label="Total Strings"
                        type="number"
                        value={updatedElevation.totalStrings}
                        onChange={(e) => handleInputChange('totalStrings', parseInt(e.target.value))}
                    />
                    <TextInput
                        label="String 1"
                        value={updatedElevation.string1}
                        onChange={(e) => handleInputChange('string1', e.target.value)}
                    />
                    <TextInput
                        label="String 2"
                        value={updatedElevation.string2 || ''}
                        onChange={(e) => handleInputChange('string2', e.target.value)}
                    />
                    <TextInput
                        label="String 3"
                        value={updatedElevation.string3 || ''}
                        onChange={(e) => handleInputChange('string3', e.target.value)}
                    />
                    <TextInput
                        label="String 4"
                        value={updatedElevation.string4 || ''}
                        onChange={(e) => handleInputChange('string4', e.target.value)}
                    />
                    <TextInput
                        label="Inverter"
                        value={updatedElevation.inverter}
                        onChange={(e) => handleInputChange('inverter', e.target.value)}
                    />
                    <TextInput
                        label="Tracker String No."
                        value={updatedElevation.trackerStringNo}
                        onChange={(e) => handleInputChange('trackerStringNo', e.target.value)}
                    />
                    <TextInput
                        label="Inverter Hybrid"
                        value={updatedElevation.inverterHybrid || ''}
                        onChange={(e) => handleInputChange('inverterHybrid', e.target.value)}
                    />
                    <TextInput
                        label="Type Test No."
                        value={updatedElevation.typeTestNo}
                        onChange={(e) => handleInputChange('typeTestNo', e.target.value)}
                    />
                    <TextInput
                        label="Rated Output Power"
                        type="number"
                        value={updatedElevation.ratedOutputPower || ''}
                        onChange={(e) => handleInputChange('ratedOutputPower', parseFloat(e.target.value))}
                    />
                    <TextInput
                        label="Battery"
                        value={updatedElevation.battery}
                        onChange={(e) => handleInputChange('battery', e.target.value)}
                    />
                    <TextInput
                        label="Mounting Kit"
                        value={updatedElevation.mountingKit}
                        onChange={(e) => handleInputChange('mountingKit', e.target.value)}
                    />
                    <TextInput
                        label="Tile Type"
                        value={updatedElevation.tileType}
                        onChange={(e) => handleInputChange('tileType', e.target.value)}
                    />
                    <TextInput
                        label="Roof Incline"
                        type="number"
                        value={updatedElevation.roofIncline}
                        onChange={(e) => handleInputChange('roofIncline', parseFloat(e.target.value))}
                    />
                    <TextInput
                        label="Variation From South"
                        value={updatedElevation.variationFromSouth}
                        onChange={(e) => handleInputChange('variationFromSouth', e.target.value)}
                    />
                    <TextInput
                        label="KWh/KWp"
                        type="number"
                        value={updatedElevation.kwhPerKwp || ''}
                        onChange={(e) => handleInputChange('kwhPerKwp', parseFloat(e.target.value))}
                    />
                    <TextInput
                        label="In Above Roof"
                        type="number"
                        value={updatedElevation.inAboveRoof || ''}
                        onChange={(e) => handleInputChange('inAboveRoof', parseFloat(e.target.value))}
                    />
                    <TextInput
                        label="Overshadowing Factor"
                        type="number"
                        value={updatedElevation.overshadingFactor || ''}
                        onChange={(e) => handleInputChange('overshadingFactor', parseFloat(e.target.value))}
                    />
                    <TextInput
                        label="No. of Panels"
                        type="number"
                        value={updatedElevation.noPanels}
                        onChange={(e) => handleInputChange('noPanels', parseInt(e.target.value))}
                    />
                    <TextInput
                        label="Array M2"
                        type="number"
                        value={updatedElevation.arrayM2 || ''}
                        onChange={(e) => handleInputChange('arrayM2', parseFloat(e.target.value))}
                    />
                    <TextInput
                        label="KWp"
                        type="number"
                        value={updatedElevation.kwp}
                        onChange={(e) => handleInputChange('kwp', parseFloat(e.target.value))}
                    />
                    <TextInput
                        label="KWh"
                        type="number"
                        value={updatedElevation.kwh || ''}
                        onChange={(e) => handleInputChange('kwh', parseFloat(e.target.value))}
                    />
                    <TextInput
                        label="CO2 Equivalent"
                        type="number"
                        value={updatedElevation.co2Equivalent || ''}
                        onChange={(e) => handleInputChange('co2Equivalent', parseFloat(e.target.value))}
                    />
                    <TextInput
                        label="Net KWp"
                        type="number"
                        value={updatedElevation.netKwp}
                        onChange={(e) => handleInputChange('netKwp', parseFloat(e.target.value))}
                    />
                    <TextInput
                        label="Meter Make"
                        value={updatedElevation.meterMake || ''}
                        onChange={(e) => handleInputChange('meterMake', e.target.value)}
                    />
                    <TextInput
                        label="Meter Model"
                        value={updatedElevation.meterModel || ''}
                        onChange={(e) => handleInputChange('meterModel', e.target.value)}
                    />
                    <TextInput
                        label="Total Cost"
                        type="number"
                        value={updatedElevation.totalCost}
                        onChange={(e) => handleInputChange('totalCost', parseFloat(e.target.value))}
                    />
                    <TextInput
                        label="Total Price"
                        value={updatedElevation.totalPrice}
                        onChange={(e) => handleInputChange('totalPrice', e.target.value)}
                    />
                    <TextInput
                        label="Given Energy"
                        value={updatedElevation.givenEnergy}
                        onChange={(e) => handleInputChange('givenEnergy', e.target.value)}
                    />
                    <Flex justify="end" gap="md">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEditedElevation}>Save</Button>
                    </Flex>
                </Stack>
            </Modal>
        </Box>
    );
};

export { ElevationDetails };
