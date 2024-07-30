import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Container, Stack } from '@mantine/core';

export default function HomePage() {
  return (
    <Container size="lg">
      <Stack spacing="xl">
        <Welcome />
        <ColorSchemeToggle />
      </Stack>
    </Container>
  );
}
