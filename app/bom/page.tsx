// elevations/page.tsx (Server Component)
import BOMCalculator from '../../components/BOMCalculator/BOMCalculator';
import {Container} from "@mantine/core";

export default function ElevationsPage() {
    return (
        <div>
            <Container>
                <h1>BOM Calculator</h1>

                <BOMCalculator/>
            </Container>
        </div>
    );
}
