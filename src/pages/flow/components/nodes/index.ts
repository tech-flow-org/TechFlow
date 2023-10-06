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
import { VoyQuerySymbol } from './VoyQuery';

export const SYMBOL_NODE_LIST = [
  StringSymbol,
  AITaskSymbol,
  SDTaskSymbol,
  NetworkSymbol,
  DingDingBotSymbol,
  EmbeddingsSymbol,
  FileReadSymbol,
  VoyQuerySymbol,
];

export const SymbolNodeMasterTypes = Object.fromEntries(
  SYMBOL_NODE_LIST.map((item) => [item.id, item.preview || DefaultPreview]).filter(Boolean),
);

export const FlowNodeRenderType = Object.fromEntries(
  SYMBOL_NODE_LIST.map((item) => [item.id, item.render || DefaultRender]).filter(Boolean),
);

export const SymbolNodeRunMap = SYMBOL_NODE_LIST.reduce((pre, current) => {
  pre[current.id] = current.run;
  return pre;
}, {} as Record<string, SymbolMasterDefinition<any>['run']>);

export const SymbolNodeRenderMap = SYMBOL_NODE_LIST.reduce((pre, current) => {
  pre[current.id] = current.outputRender;
  return pre;
}, {} as Record<string, SymbolMasterDefinition<any>['outputRender']>);

export const SymbolSchemaRenderMap = SYMBOL_NODE_LIST.reduce((pre, current) => {
  pre[current.id] = current.schema;
  return pre;
}, {} as Record<string, SymbolMasterDefinition<any>['schema']>);
