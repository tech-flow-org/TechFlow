import { ConfigSettings } from '@/types/exportConfig';

import { ThemeAppearance } from 'antd-style';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SidebarTabKey = 'chat' | 'flow' | 'comfy';

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
      sessionsWidth: 320,
      sessionExpandable: true,
      sidebarKey: 'chat',
      importSettings: (settings) => {
        set({ ...settings });
      },
    }),
    { name: 'CHAT_SETTINGS', skipHydration: true },
  ),
);
