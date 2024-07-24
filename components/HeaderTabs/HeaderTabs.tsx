import cx from 'clsx';
import { useState } from 'react';
import {
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {
  IconLogout,
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconSwitchHorizontal,
  IconChevronDown,
  IconGauge,
  IconFingerprint,
  IconActivity,
  IconChevronRight,
  IconBellRinging,
  IconReceipt2,
  IconKey,
  IconDatabaseImport,
  Icon2fa,
} from '@tabler/icons-react';
import classes from './HeaderTabs.module.css';

const user = {
  name: 'Graham Walden',
  email: 'graham.walden@example.com',
  image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
};

const tabs = [
  { link: '/elevations', label: 'Elevations', icon: IconBellRinging },
  { link: '', label: 'Projects', icon: IconReceipt2 },
  { link: '', label: 'Plots', icon: IconFingerprint },
  { link: '', label: 'Plots missing data', icon: IconKey },
  { link: '', label: 'Project in Permitting', icon: IconDatabaseImport },
  { link: '/bom', label: 'BOM Calculatrix', icon: Icon2fa },
  { link: '', label: 'People', icon: IconSettings },
];

export function HeaderTabs() {
  const theme = useMantineTheme();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab.label} key={tab.label} leftSection={<tab.icon size="0.8rem" />}>
      {tab.label}
    </Tabs.Tab>
  ));

  return (
    <Group>
      <Tabs
        defaultValue="Dashboard"
        variant="outline"
        visibleFrom="sm"
        classNames={{
          root: classes.tabs,
          list: classes.tabsList,
          tab: classes.tab,
        }}
      >
        <Tabs.List>{items}</Tabs.List>
      </Tabs>

      <Menu
        width={260}
        position="bottom-end"
        transitionProps={{ transition: 'pop-top-right' }}
        onClose={() => setUserMenuOpened(false)}
        onOpen={() => setUserMenuOpened(true)}
        withinPortal
      >
        <Menu.Target>
          <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
            <Group gap={7}>
              <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
              <Text fw={500} size="sm" lh={1} mr={3}>
                {user.name}
              </Text>
              <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              <IconHeart
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.red[6]}
                stroke={1.5}
              />
            }
          >
            My Projects
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconStar
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.yellow[6]}
                stroke={1.5}
              />
            }
          >
            My Bookmarked Plots
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconMessage
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
                stroke={1.5}
              />
            }
          >
            My Permits
          </Menu.Item>

          <Menu.Label>Settings</Menu.Label>
          <Menu.Item
            leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          >
            Account settings
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            }
          >
            Change Password
          </Menu.Item>
          <Menu.Item
            leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
