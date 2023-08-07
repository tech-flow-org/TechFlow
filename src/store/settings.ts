import { ConfigSettings } from '@/types/exportConfig';

import { ThemeAppearance } from 'antd-style';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export type SidebarTabKey = 'chat' | 'flow' | 'runner';

interface SettingsStore {
  fontSize: number;
  sessionsWidth: number;
  contentWidth: number;
  avatar?: string;
  sessionExpandable?: boolean;
  sidebarKey: SidebarTabKey;
  appearance?: ThemeAppearance;
  importSettings: (settings: ConfigSettings) => void;
}

export const useSettings = createWithEqualityFn<SettingsStore>()(
  persist<SettingsStore>(
    (set) => ({
      fontSize: 16,
      contentWidth: 800,
      avatar: 'https://techflow.antdigital.dev/favicon.png',
      sessionsWidth: 240,
      sessionExpandable: true,
      sidebarKey: 'chat',
      importSettings: (settings) => {
        set({ ...settings });
      },
    }),
    { name: 'CHAT_SETTINGS', skipHydration: true },
  ),
  shallow,
);
