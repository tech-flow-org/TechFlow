import type { Migration, MigrationData } from '../utils/VersionController';

export class MigrationV2ToV3 implements Migration {
  /***
   * 配置项里的当前版本号
   */
  version = 2;

  migrate(data: MigrationData): MigrationData {
    // V3 中会有 flow，而 v2 中没有 settings
    if (!data.state.flow) data.state.flow = {};
    return data;
  }
}
