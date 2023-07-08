import { ConfigSettings } from '@/types/exportConfig';

import { ThemeAppearance } from 'antd-style';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const useSettings = create<SettingsStore>()(
  persist<SettingsStore>(
    (set) => ({
      fontSize: 16,
      contentWidth: 800,
      avatar:
        'https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*xAMjRZ4-qYAAAAAAAAAAAAAADml6AQ/original',
      sessionsWidth: 240,
      sessionExpandable: true,
      sidebarKey: 'chat',
      importSettings: (settings) => {
        set({ ...settings });
      },
    }),
    { name: 'CHAT_SETTINGS', skipHydration: true },
  ),
);
