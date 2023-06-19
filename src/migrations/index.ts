import { ConfigState } from '@/types';
import { VersionController } from '@/utils/VersionController';
import { MigrationV0ToV1 } from './FromV0ToV1';
import { MigrationV1ToV2 } from './V1ToV2-RefactorSystemRole';
import { MigrationV2ToV3 } from './V2ToV3-AddFlow';

// 当前最新的版本号
export const CURRENT_CONFIG_VERSION = 3;

// 历史记录版本升级模块
export const ConfigMigrations = [
  /**
   * 2023.05.19 更新为 V3 ，添加 flows 数据模型
   */
  MigrationV2ToV3,
  /**
   * 2023.04.13 更新为 V2 ，重构 sessions 的数据结构为 chats 和 agents
   */
  MigrationV1ToV2,
  /**
   * 2023.04.10 更新为 V1 ，补充 settings 字段
   */
  MigrationV0ToV1,
];

export const Migration = new VersionController<ConfigState>(
  ConfigMigrations.reverse(),
  CURRENT_CONFIG_VERSION,
);
