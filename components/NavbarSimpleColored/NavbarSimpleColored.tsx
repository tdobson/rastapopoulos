'use client';
import { useState } from 'react';
import { Group, Code, Anchor } from '@mantine/core';
import { IconSwitchHorizontal, IconLogout } from '@tabler/icons-react';
import classes from './NavbarSimpleColored.module.css';
import { navigationItems } from '../../utils/navigationItems';

// Define the version as a constant
const version = '0.1.0'; // Update this manually when changing the version in package.json

export function NavbarSimpleColored() {
  const [active, setActive] = useState('Billing');

  const links = navigationItems.map((item) => (
    <Anchor
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Anchor>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Code fw={700} className={classes.version}>
            v{version}
          </Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <Anchor href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </Anchor>

        <Anchor href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </Anchor>
      </div>
    </nav>
  );
}
