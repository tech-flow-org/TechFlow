import { Mask, ModelConfig } from '../mask';

export type BuiltinMask = Omit<Mask, 'id' | 'modelConfig'> & {
  builtin: boolean;
  modelConfig: Partial<ModelConfig>;
};
