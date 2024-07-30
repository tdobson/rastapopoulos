'use client';

import dynamic from 'next/dynamic';
import { Container } from '@mantine/core';

const BOMCalculator = dynamic(() => import('../../components/BOMCalculator/BOMCalculator'), {
  ssr: false,
});

export default function BOMPage() {
  return (
    <div>
      <Container>
        <h1>Tim's Magic BOM Calculatrix</h1>
        <BOMCalculator />
      </Container>
    </div>
  );
}
