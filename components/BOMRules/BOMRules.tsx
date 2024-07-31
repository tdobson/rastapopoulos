import React from 'react';
import { Text, List, Box, Title } from '@mantine/core';

const BOMRules: React.FC = () => {
  return (
    <Box>
      <Title order={3}>BOM Calculation Rules</Title>
      <List>
        <List.Item>
          <Text>
            <strong>GSE Half Portrait Frames:</strong> 2 per SinglePanel, TopSinglePanel, and
            BottomSinglePanel
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Lateral Flashing:</strong> 2 per SinglePanel, TopSinglePanel, BottomSinglePanel,
            and EndPanel, then doubled
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>GSE Screws Black:</strong> 3 per SinglePanel, TopSinglePanel, BottomSinglePanel,
            and EndPanel, plus 1 extra per EndPanel and MidPanel
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>GSE Screws Silver:</strong> 3 per panel
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>GSE End Clamp:</strong> 4 per SinglePanel, TopSinglePanel, and
            BottomSinglePanel, 2 per EndPanel
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>GSE Mid Clamp:</strong> 2 per MidPanel, MiddleMidPanel, TopMidPanel, and
            BottomMidPanel
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
            <strong>Lead:</strong> Calculated based on the number of panels across the bottom row of
            the array and the maximum width of non-bottom rows. Lead comes in two types:
            <List withPadding>
              <List.Item>
                <strong>Normal Lead (1500mm length):</strong> Calculated based on the number of
                panels across the bottom row of the array. The required length is determined using
                the leadMeterageTable and then divided by 1500mm (rounded up) to get the number of
                pieces.
              </List.Item>
              <List.Item>
                <strong>Deep Lead (800mm width, 1500mm length):</strong> Calculated based on the
                total width of the array, minus the bottom row. The required length is one piece of lead per panel.
              </List.Item>
              <List.Item>
                Example calculations:
                <List withPadding>
                  <List.Item>
                    1 panel: 2 pieces of normal lead (2100mm / 1500mm = 1.4, rounded up to 2)
                  </List.Item>
                  <List.Item>
                    3 panels: 3 pieces of normal lead (4475mm / 1500mm = 2.98, rounded up to 3)
                  </List.Item>
                  <List.Item>
                    8 panels: 8 pieces of normal lead ((8900mm + 1375mm + 1375mm) / 1500mm = 7.77,
                    rounded up to 8)
                  </List.Item>
                </List>
              </List.Item>
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
            <strong>Tile Kicker Bars:</strong> 1 per non-top row panel
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Kicker Bar Hooks:</strong> 2 per non-top row panel
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
            <strong>Lateral Flashing Hooks:</strong> 2 per EndPanel, 4 per SinglePanel,
            TopSinglePanel, and BottomSinglePanel
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
        <List.Item>
          <Text>
            <strong>Wire Clout Nails 65mm:</strong> 5 nails per batten
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Panel Wedge:</strong> 1 wedge per horizontal row of panels
          </Text>
        </List.Item>
      </List>
    </Box>
  );
};

export default BOMRules;
