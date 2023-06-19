import { Workflow } from './flow';
import { ChatSessionState } from './sessions';

/**
 * 配置设置
 */
export interface ConfigSettings {
  /**
   * 头像链接
   */
  avatar?: string;
  /**
   * 字体大小
   */
  fontSize: number;
  /**
   * 内容宽度
   */
  contentWidth: number;
}

export interface ConfigState extends ChatSessionState {
  /**
   * V1 添加
   */
  settings: ConfigSettings;
  /**
   * V3 添加
   */
  flows: Record<string, Workflow>;
}

export interface ConfigFile {
  state: ConfigState;
  /**
   * 配置文件的版本号
   */
  version: number;
}
