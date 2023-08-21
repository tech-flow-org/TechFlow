import { SymbolMasterDefinition } from '@/types/flow';
import { DefaultPreview } from '../DefaultPreview';
import { DefaultRender } from '../DefaultRender';
import { AITaskSymbol } from './AITask';
import { DingDingBotSymbol } from './DingDingBot';
import { EmbeddingsSymbol } from './Embeddings';
import { FileReadSymbol } from './FileRead';
import { NetworkSymbol } from './NetWork';
import { SDTaskSymbol } from './SD';
import { StringSymbol } from './String';

export const symbolNodeList: SymbolMasterDefinition<any>[] = [
  StringSymbol,
  AITaskSymbol,
  SDTaskSymbol,
  NetworkSymbol,
  DingDingBotSymbol,
  EmbeddingsSymbol,
  FileReadSymbol,
];

export const SymbolNodeMasterTypes = Object.fromEntries(
  symbolNodeList.map((item) => [item.id, item.preview || DefaultPreview]).filter(Boolean),
);

export const FlowNodeRenderType = Object.fromEntries(
  symbolNodeList.map((item) => [item.id, item.render || DefaultRender]).filter(Boolean),
);

export const SymbolNodeRunMap = symbolNodeList.reduce((pre, current) => {
  pre[current.id] = current.run;
  return pre;
}, {} as Record<string, SymbolMasterDefinition<any>['run']>);

export const SymbolNodeRenderMap = symbolNodeList.reduce((pre, current) => {
  pre[current.id] = current.outputRender;
  return pre;
}, {} as Record<string, SymbolMasterDefinition<any>['outputRender']>);

export const SymbolSchemaRenderMap = symbolNodeList.reduce((pre, current) => {
  pre[current.id] = current.schema;
  return pre;
}, {} as Record<string, SymbolMasterDefinition<any>['schema']>);
