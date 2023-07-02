import { SymbolMasterDefinition } from '@/types/flow';
import { AITaskSymbol } from './AITask';
import { OutputSymbol } from './NetWork';
import { SDTaskSymbol } from './SD';
import { StringSymbol } from './String';

export const symbolNodeList: SymbolMasterDefinition<any>[] = [
  StringSymbol,
  AITaskSymbol,
  SDTaskSymbol,
  OutputSymbol,
];

export const SymbolNodeMasterTypes = Object.fromEntries(
  symbolNodeList.map((item) => [item.id, item.preview]).filter(Boolean),
);

export const FlowNodeRenderType = Object.fromEntries(
  symbolNodeList.map((item) => [item.id, item.render]).filter(Boolean),
);

export const SymbolNodeRunMap = symbolNodeList.reduce((pre, current) => {
  pre[current.id] = current.run;
  return pre;
}, {} as Record<string, SymbolMasterDefinition<any>['run']>);
