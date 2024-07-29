import { Container, Group, Anchor } from '@mantine/core';
import classes from './FooterSimple.module.css';
import { navigationItems } from '../../utils/navigationItems';

interface FooterSimpleProps {
  links?: typeof navigationItems;
}

export function FooterSimple({ links = navigationItems }: FooterSimpleProps) {
  const items = links.map((link) => (
    <Anchor
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
      c="dimmed"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </footer>
  );
}
