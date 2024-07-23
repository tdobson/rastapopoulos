// elevations/page.tsx (Server Component)
import { Container } from '@mantine/core';
import BOMCalculator from '../../components/BOMCalculator/BOMCalculator';

export default function ElevationsPage() {
    return (
        <div>
            <Container>
                <h1>BOM Calculator</h1>
                <BOMCalculator />
            </Container>
        </div>
    );
}
