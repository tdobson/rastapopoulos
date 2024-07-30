import React from 'react';
import { Text, List, Box, Title } from '@mantine/core';

const BOMRules: React.FC = () => {
  return (
    <Box>
      <Title order={3}>BOM Calculation Rules</Title>
      <List>
        <List.Item>
          <Text>
            <strong>GSE Half Portrait Frames:</strong> 2 per SinglePanel, TopSinglePanel, and BottomSinglePanel
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Lateral Flashing:</strong> 2 per SinglePanel, TopSinglePanel, BottomSinglePanel, and EndPanel, then doubled
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>GSE Screws Black:</strong> 3 per SinglePanel, TopSinglePanel, BottomSinglePanel, and EndPanel, plus 1 extra per EndPanel and MidPanel
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>GSE Screws Silver:</strong> 3 per panel
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>GSE End Clamp:</strong> 4 per SinglePanel, TopSinglePanel, and BottomSinglePanel, 2 per EndPanel
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>GSE Mid Clamp:</strong> 2 per MidPanel, MiddleMidPanel, TopMidPanel, and BottomMidPanel
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Compressed Seal Roll:</strong> 1 roll per 10 panels (rounded up)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Pre Assembled DC Lead:</strong> 2 per string
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>DC Live Sticker:</strong> 1 per string
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Cable Ties:</strong> 5 per 10 panels (rounded up)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Battens:</strong> Calculated based on the number of rows and columns in the grid
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Lead:</strong> Calculated based on the total number of panels. Lead comes in 1500mm lengths and is used for both standard and 600mm deep applications. The quantity is determined by this table:
            <List withPadding>
              <List.Item>1 panel: 2100mm (2 pieces)</List.Item>
              <List.Item>2 panels: 3400mm (3 pieces)</List.Item>
              <List.Item>3 panels: 4475mm (3 pieces)</List.Item>
              <List.Item>4 panels: 6000mm (4 pieces)</List.Item>
              <List.Item>5 panels: 7275mm (5 pieces)</List.Item>
              <List.Item>6 panels: 8900mm (6 pieces)</List.Item>
              <List.Item>7+ panels: 8900mm + 1375mm per additional panel</List.Item>
            </List>
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Copper Nails:</strong> 3 per piece of lead
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Tile Kicker Bars:</strong> 1 per top row panel
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Kicker Bar Hooks:</strong> 2 per top row panel
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Flexalu Top Flashing:</strong> 1 per 4 top row panels (rounded up)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Arc Box:</strong> 1 per string
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Arc Box Bracket:</strong> 1 per string
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Roofer Guide Sheet:</strong> 1 per plot
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Lateral Flashing Hooks:</strong> 2 per EndPanel, 4 per SinglePanel, TopSinglePanel, and BottomSinglePanel
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Lateral Flashing Nails Galv 20mm:</strong> Same as Lateral Flashing Hooks
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Uberflex Carpet Flashing:</strong> 1 per BottomLeftCorner and BottomRightCorner
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Solar Panels:</strong> 1 per active cell in the grid
          </Text>
        </List.Item>
      </List>
    </Box>
  );
};

export default BOMRules;
