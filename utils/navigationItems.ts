import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
} from '@tabler/icons-react';

export const navigationItems = [
  { link: '/elevations', label: 'Elevations', icon: IconBellRinging },
  { link: '', label: 'Projects', icon: IconReceipt2 },
  { link: '', label: 'Plots', icon: IconFingerprint },
  { link: '', label: 'Plots missing data', icon: IconKey },
  { link: '', label: 'Project in Permitting', icon: IconDatabaseImport },
  { link: '/bom', label: 'BOM Calculator', icon: Icon2fa },
  { link: '', label: 'People', icon: IconSettings },
];
