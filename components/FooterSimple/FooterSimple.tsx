import { Container, Group, Anchor } from '@mantine/core';
import classes from './FooterSimple.module.css';
import {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFingerprint,
  IconKey,
  IconReceipt2,
  IconSettings,
} from '@tabler/icons-react';

interface FooterLink {
  link: string;
  label: string;
}

interface FooterSimpleProps {
  links?: FooterLink[];
}

const defaultLinks: FooterLink[] = [
  { link: '/elevations', label: 'Elevations', icon: IconBellRinging },
  { link: '', label: 'Projects', icon: IconReceipt2 },
  { link: '', label: 'Plots', icon: IconFingerprint },
  { link: '', label: 'Plots missing data', icon: IconKey },
  { link: '', label: 'Project in Permitting', icon: IconDatabaseImport },
  { link: '/bom', label: 'BOM Calculatrix', icon: Icon2fa },
  { link: '', label: 'People', icon: IconSettings },
];

export function FooterSimple({ links = defaultLinks }: FooterSimpleProps) {
  const items = links.map((link) => (
    <Anchor<'a'>
      c="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
