import React from 'react';
import { Text, List, Box, Title } from '@mantine/core';

const BOMRules: React.FC = () => {
  return (
    <Box>
      <Title order={3}>BOM Calculation Rules</Title>
      <List>
        <List.Item>
          <Text>
            <strong>Solar Panels:</strong> 1 per active cell (totalPanelCount)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>GSE Half Portrait Frames:</strong> 2 per panel (totalPanelCount * 2)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>GSE End Clamp:</strong> 4 for single panels, 2 for end panels ((SinglePanel + TopSinglePanel + CenterSinglePanel + BottomSinglePanel) * 4 + (BottomEndPanel + TopEndPanel + MiddleEndPanel + EndPanel) * 2)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>GSE Mid Clamp:</strong> 2 for mid panels, 1 for end panels ((MidPanel + MiddleMidPanel + TopMidPanel + BottomMidPanel) * 2 + (BottomEndPanel + TopEndPanel + MiddleEndPanel + EndPanel) * 1)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>GSE Screws Black:</strong> 4 for single panels, 3 for end panels, 2 for mid panels ((SinglePanel + TopSinglePanel + BottomSinglePanel + CenterSinglePanel) * 4 + (EndPanel + BottomEndPanel + TopEndPanel + MiddleEndPanel) * 3 + (MidPanel + MiddleMidPanel + TopMidPanel + BottomMidPanel) * 2)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>GSE Screws Silver:</strong> 6 per panel (totalPanelCount * 6)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Lateral Flashing:</strong> 2 for single panels, 1 for end panels, doubled for both sides ((SinglePanel + TopSinglePanel + BottomSinglePanel + CenterSinglePanel) * 2 + (BottomEndPanel + MiddleEndPanel + TopEndPanel + EndPanel)) * 2
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Lateral Flashing Hooks:</strong> 4 for single panels, 2 for end and mid panels ((SinglePanel + TopSinglePanel + CenterSinglePanel + BottomSinglePanel) * 4 + (EndPanel + TopEndPanel + MiddleEndPanel + BottomEndPanel + BottomMidPanel + TopMidPanel) * 2)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Lateral Flashing Nails Galv 20mm:</strong> 4 for single panels, 2 for end and mid panels ((SinglePanel + TopSinglePanel + CenterSinglePanel + BottomSinglePanel) * 4 + (EndPanel + TopEndPanel + MiddleEndPanel + BottomEndPanel + BottomMidPanel + TopMidPanel) * 2)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Flexalu Top Flashing:</strong> 1 per 4 top row panels, rounded up (Math.ceil(totalTopRowPanelCount / 4))
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Uberflex Carpet Flashing:</strong> 1 for each bottom corner (BottomLeftCorner + BottomRightCorner)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Tile Kicker Bars:</strong> 1 per top row panel and panels with no panel above (totalTopRowPanelCount)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Kicker Bar Hooks:</strong> 2 per kicker bar (totalTopRowPanelCount * 2)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Compressed Seal Roll:</strong> 1 per horizontal row (horizontalRowCount * 1)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Panel Wedge:</strong> 1 per horizontal row of panels (horizontalRowCount)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Battens:</strong> Calculated based on rows and columns using a lookup table (battenQuantity)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Wire Clout Nails 65mm:</strong> 5 per batten (battenQuantity * 5)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Lead:</strong> Calculated based on bottom row panels using a meterage table (leadQuantity)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Lead 600mm:</strong> 1 per non-top row panel (nonTopRowPanelCount)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Copper Nails:</strong> 3 per piece of lead (leadQuantity * 3)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Pre Assembled DC Lead:</strong> 2 per string (numberOfStrings * 2)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>DC Live Sticker:</strong> 1 per string (numberOfStrings)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Arc Box:</strong> 2 per string (numberOfStrings * 2)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Arc Box Bracket:</strong> 2 per string (numberOfStrings * 2)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Cable Ties:</strong> 5 per 10 panels, rounded up (Math.ceil(totalPanelCount / 10) * 5)
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Roofer Guide Sheet:</strong> 1 per installation
          </Text>
        </List.Item>
      </List>
    </Box>
  );
};

export default BOMRules;
