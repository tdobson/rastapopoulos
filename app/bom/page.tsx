'use client';

import dynamic from 'next/dynamic';
import { Container, Title } from '@mantine/core';

const BOMCalculator = dynamic(() => import('../../components/BOMCalculator/BOMCalculator'), {
  ssr: false,
});

export default function BOMPage() {
  return (
    <div>
      <Container>
        <Title order={1}>Tim's Magic BOM Calculator</Title>
        <BOMCalculator />
      </Container>
    </div>
  );
}
