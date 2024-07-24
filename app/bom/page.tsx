// elevations/page.tsx (Server Component)
import { Container } from '@mantine/core';
import BOMCalculator from '../../components/BOMCalculator/BOMCalculator';

export default function ElevationsPage() {
  return (
    <div>
      <Container>
        <h1>Tim's Magic BOM Calculatrix</h1>
        <BOMCalculator />
      </Container>
    </div>
  );
}
