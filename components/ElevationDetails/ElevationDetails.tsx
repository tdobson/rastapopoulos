// components/ElevationDetails/ElevationDetails.tsx
import React, { useState } from 'react';
import {
  ActionIcon,
  Box,
  Divider,
  Flex,
  Text,
  Title,
  Tooltip,
  Modal,
  Stack,
  TextInput,
  Button,
} from '@mantine/core';
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
    await onDeleteElevation(elevation.plot_id);
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
          <strong>Plot ID:</strong> {elevation.plot_id}
        </Text>
        <Text>
          <strong>Job Code:</strong> {elevation['Job Code']}
        </Text>
        <Text>
          <strong>Plot Number:</strong> {elevation.plot_number}
        </Text>
        <Text>
          <strong>House Type:</strong> {elevation.housetype || 'N/A'}
        </Text>
        <Text>
          <strong>House No:</strong> {elevation.house_no || 'N/A'}
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
          <strong>Panel KWp:</strong> {elevation.panelkwp}
        </Text>
        <Text>
          <strong>MCS Code:</strong> {elevation.mcscode}
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
          <strong>Total Strings:</strong> {elevation.totalstrings}
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
          <strong>Tracker String No:</strong> {elevation.trackerstringno}
        </Text>
        <Text>
          <strong>Inverter Hybrid:</strong> {elevation.inverterhybrid || 'N/A'}
        </Text>
        <Text>
          <strong>Type Test No:</strong> {elevation.typetestno}
        </Text>
        <Text>
          <strong>Rated Output Power:</strong> {elevation.ratedoutputpower || 'N/A'}
        </Text>
        <Text>
          <strong>Battery:</strong> {elevation.battery}
        </Text>
        <Text>
          <strong>Mounting Kit:</strong> {elevation.mountingkit}
        </Text>
        <Text>
          <strong>Tile Type:</strong> {elevation.tiletype}
        </Text>
        <Text>
          <strong>Roof Incline:</strong> {elevation.roofincline}
        </Text>
        <Text>
          <strong>Variation From South:</strong> {elevation.variationfromsouth}
        </Text>
        <Text>
          <strong>KWh/KWp:</strong> {elevation.kwhperkwp || 'N/A'}
        </Text>
        <Text>
          <strong>In Above Roof:</strong> {elevation.inaboveroof || 'N/A'}
        </Text>
        <Text>
          <strong>Overshadowing Factor:</strong> {elevation.overshadingfactor || 'N/A'}
        </Text>
        <Text>
          <strong>No. of Panels:</strong> {elevation.nopanels}
        </Text>
        <Text>
          <strong>Array M2:</strong> {elevation.arraym2 || 'N/A'}
        </Text>
        <Text>
          <strong>KWp:</strong> {elevation.kwp}
        </Text>
        <Text>
          <strong>KWh:</strong> {elevation.kwh || 'N/A'}
        </Text>
        <Text>
          <strong>CO2 Equivalent:</strong> {elevation.co2equivalent || 'N/A'}
        </Text>
        <Text>
          <strong>Net KWp:</strong> {elevation.netkwp}
        </Text>
        <Text>
          <strong>Meter Make:</strong> {elevation.metermake || 'N/A'}
        </Text>
        <Text>
          <strong>Meter Model:</strong> {elevation.metermodel || 'N/A'}
        </Text>
        <Text>
          <strong>Total Cost:</strong> {elevation.totalcost}
        </Text>
        <Text>
          <strong>Total Price:</strong> {elevation.totalprice}
        </Text>
        <Text>
          <strong>Given Energy:</strong> {elevation.givenergy}
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
            value={updatedElevation.plot_id}
            onChange={(e) => handleInputChange('plot_id', e.target.value)}
          />
          <TextInput
            label="Job Code"
            value={updatedElevation['Job Code']}
            onChange={(e) => handleInputChange('Job Code', e.target.value)}
          />
          <TextInput
            label="Plot Number"
            value={updatedElevation.plot_number}
            onChange={(e) => handleInputChange('plot_number', e.target.value)}
          />
          <TextInput
            label="House Type"
            value={updatedElevation.housetype || ''}
            onChange={(e) => handleInputChange('housetype', e.target.value)}
          />
          <TextInput
            label="House No."
            value={updatedElevation.house_no || ''}
            onChange={(e) => handleInputChange('house_no', e.target.value)}
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
            value={updatedElevation.panelkwp}
            onChange={(e) => handleInputChange('panelkwp', parseFloat(e.target.value))}
          />
          <TextInput
            label="MCS Code"
            value={updatedElevation.mcscode}
            onChange={(e) => handleInputChange('mcscode', e.target.value)}
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
            value={updatedElevation.totalstrings}
            onChange={(e) => handleInputChange('totalstrings', parseInt(e.target.value))}
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
            value={updatedElevation.trackerstringno}
            onChange={(e) => handleInputChange('trackerstringno', e.target.value)}
          />
          <TextInput
            label="Inverter Hybrid"
            value={updatedElevation.inverterhybrid || ''}
            onChange={(e) => handleInputChange('inverterhybrid', e.target.value)}
          />
          <TextInput
            label="Type Test No."
            value={updatedElevation.typetestno}
            onChange={(e) => handleInputChange('typetestno', e.target.value)}
          />
          <TextInput
            label="Rated Output Power"
            type="number"
            value={updatedElevation.ratedoutputpower || ''}
            onChange={(e) => handleInputChange('ratedoutputpower', parseFloat(e.target.value))}
          />
          <TextInput
            label="Battery"
            value={updatedElevation.battery}
            onChange={(e) => handleInputChange('battery', e.target.value)}
          />
          <TextInput
            label="Mounting Kit"
            value={updatedElevation.mountingkit}
            onChange={(e) => handleInputChange('mountingkit', e.target.value)}
          />
          <TextInput
            label="Tile Type"
            value={updatedElevation.tiletype}
            onChange={(e) => handleInputChange('tiletype', e.target.value)}
          />
          <TextInput
            label="Roof Incline"
            type="number"
            value={updatedElevation.roofincline}
            onChange={(e) => handleInputChange('roofincline', parseFloat(e.target.value))}
          />
          <TextInput
            label="Variation From South"
            value={updatedElevation.variationfromsouth}
            onChange={(e) => handleInputChange('variationfromsouth', e.target.value)}
          />
          <TextInput
            label="KWh/KWp"
            type="number"
            value={updatedElevation.kwhperkwp || ''}
            onChange={(e) => handleInputChange('kwhperkwp', parseFloat(e.target.value))}
          />
          <TextInput
            label="In Above Roof"
            type="number"
            value={updatedElevation.inaboveroof || ''}
            onChange={(e) => handleInputChange('inaboveroof', parseFloat(e.target.value))}
          />
          <TextInput
            label="Overshadowing Factor"
            type="number"
            value={updatedElevation.overshadingfactor || ''}
            onChange={(e) => handleInputChange('overshadingfactor', parseFloat(e.target.value))}
          />
          <TextInput
            label="No. of Panels"
            type="number"
            value={updatedElevation.nopanels}
            onChange={(e) => handleInputChange('nopanels', parseInt(e.target.value))}
          />
          <TextInput
            label="Array M2"
            type="number"
            value={updatedElevation.arraym2 || ''}
            onChange={(e) => handleInputChange('arraym2', parseFloat(e.target.value))}
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
            value={updatedElevation.co2equivalent || ''}
            onChange={(e) => handleInputChange('co2equivalent', parseFloat(e.target.value))}
          />
          <TextInput
            label="Net KWp"
            type="number"
            value={updatedElevation.netkwp}
            onChange={(e) => handleInputChange('netkwp', parseFloat(e.target.value))}
          />
          <TextInput
            label="Meter Make"
            value={updatedElevation.metermake || ''}
            onChange={(e) => handleInputChange('metermake', e.target.value)}
          />
          <TextInput
            label="Meter Model"
            value={updatedElevation.metermodel || ''}
            onChange={(e) => handleInputChange('metermodel', e.target.value)}
          />
          <TextInput
            label="Total Cost"
            type="number"
            value={updatedElevation.totalcost}
            onChange={(e) => handleInputChange('totalcost', parseFloat(e.target.value))}
          />
          <TextInput
            label="Total Price"
            value={updatedElevation.totalprice}
            onChange={(e) => handleInputChange('totalprice', e.target.value)}
          />
          <TextInput
            label="Given Energy"
            value={updatedElevation.givenergy}
            onChange={(e) => handleInputChange('givenergy', e.target.value)}
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
