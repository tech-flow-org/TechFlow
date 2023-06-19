import { SymbolMasterDefinition } from '@/types/flow';
import { AITaskSymbol } from './AITask';
import { OutputSymbol } from './Output';
import { StringSymbol } from './String';

export const symbolNodeList: SymbolMasterDefinition<any>[] = [
  StringSymbol,
  AITaskSymbol,
  OutputSymbol,
];

export const SymbolNodeMasterTypes = Object.fromEntries(
  symbolNodeList.map((item) => [item.id, item.preview]).filter(Boolean),
);

export const FlowNodeRenderType = Object.fromEntries(
  symbolNodeList.map((item) => [item.id, item.render]).filter(Boolean),
);
