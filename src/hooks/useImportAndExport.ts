import isEqual from 'fast-deep-equal';
import { useMemo } from 'react';
import { shallow } from 'zustand/shallow';

import { notification } from '@/layout';
import { useSessionStore, useSettings } from '@/store';
import { useFlowStore } from '@/store/flow';
import { ConfigFile, ConfigSettings } from '@/types';

export const useImportAndExport = () => {
  const [chats, agents, importChatSessions] = useSessionStore(
    (s) => [s.chats, s.agents, s.importChatSessions],
    shallow,
  );
  const [flows] = useFlowStore((s) => [s.flows], shallow);
  const settings = useSettings(
    (s): ConfigSettings => ({
      avatar: s.avatar,
      fontSize: s.fontSize,
      contentWidth: s.contentWidth,
    }),
    isEqual,
  );

  const importSettings = useSettings((s) => s.importSettings);

  // 将 入参转换为 配置文件格式
  const config: ConfigFile = {
    state: { chats, agents, settings, flows },
    version: 3.0,
  };

  const exportConfigFile = () => {
    // 创建一个 Blob 对象
    const blob = new Blob([JSON.stringify(config)], { type: 'application/json' });

    // 创建一个 URL 对象，用于下载
    const url = URL.createObjectURL(blob);

    // 创建一个 <a> 元素，设置下载链接和文件名
    const a = document.createElement('a');
    a.href = url;
    a.download = `TechFLow_Config_v3.0.json`;

    // 触发 <a> 元素的点击事件，开始下载
    document.body.appendChild(a);
    a.click();

    // 下载完成后，清除 URL 对象
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleImport = (info: any) => {
    const reader = new FileReader();
    //读取完文件之后的回调函数
    reader.onloadend = function (evt) {
      const fileString = evt.target?.result;
      const fileJson = fileString as string;

      try {
        const { state } = JSON.parse(fileJson);
        if (isEqual(config, state)) return;

        importChatSessions(state);
        importSettings(state.settings);

        // TODO：未来看是否需要收 import 一个方法到 flowStore 中
        useFlowStore.setState({ flows: state.flows });
      } catch (e) {
        notification.error({
          message: '导入失败',
          description: `出错原因: ${(e as Error).message}`,
        });
      }
    };

    //@ts-ignore file 类型不明确
    reader.readAsText(info.file.originFileObj, 'UTF-8');
  };

  return useMemo(() => ({ exportConfigFile, handleImport }), [chats, agents, settings]);
};
