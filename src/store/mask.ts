import { createMask, deleteMask, queryMaskList, updateMask } from '@/services/mask';
import { StoreKey } from '@/utils/constant';
import { persist } from 'zustand/middleware';
import shallow from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { BUILTIN_MASKS } from './masks';

export const ALL_MODELS = [
  {
    name: 'gpt-3.5-turbo',
    available: true,
  },
  {
    name: 'gpt-3.5-turbo-0301',
    available: true,
  },
  {
    name: 'gpt-3.5-turbo-0613',
    available: true,
  },
] as const;

export type ModelType = (typeof ALL_MODELS)[number]['name'];

export type ChatMessage = {
  date: string;
  streaming?: boolean;
  isError?: boolean;
  id?: number;
  model?: ModelType;
  content?: string;
  role?: 'system' | 'assistant' | 'user';
};

const defaultModelConfig = {
  model: 'gpt-3.5-turbo' as ModelType,
  temperature: 0.5,
  max_tokens: 2000,
  presence_penalty: 0,
  frequency_penalty: 0,
  sendMemory: true,
  historyMessageCount: 4,
  compressMessageLengthThreshold: 1000,
  template: '1',
};

export type ModelConfig = typeof defaultModelConfig;

export type Mask = {
  id: number;
  avatar: string;
  name: string;
  hideContext?: boolean;
  context: ChatMessage[];
  modelConfig?: Partial<ModelConfig>;
  lang: 'zh-CN';
  builtin: boolean;
  syncGlobalConfig?: boolean;
  content?: string;
};

export const DEFAULT_MASK_STATE = {
  masks: {} as Record<number, Mask>,
  globalMaskId: 0,
};

export type MaskState = typeof DEFAULT_MASK_STATE;

type MaskStore = MaskState & {
  create: (mask?: Partial<Mask>) => Promise<Mask>;
  createByServe: (mask?: Partial<Mask>) => Promise<Mask>;
  update: (id: number, updater: (mask: Mask) => void) => void;
  delete: (id: number) => void;
  search: (text: string) => Mask[];
  get: (id?: number) => Mask | null;
  getAll: () => Mask[];
  querySevereList: () => Promise<Mask[]>;
};

export const DEFAULT_MASK_ID = 1145141919810;
export const DEFAULT_MASK_AVATAR = 'gpt-bot';
export const createEmptyMask = () =>
  ({
    id: DEFAULT_MASK_ID,
    avatar: DEFAULT_MASK_AVATAR,
    name: '新的角色',
    context: [],
    syncGlobalConfig: true, // use global config as default
    modelConfig: {
      model: 'gpt-3.5-turbo' as ModelType,
      temperature: 0.5,
      max_tokens: 2000,
      presence_penalty: 0,
      frequency_penalty: 0,
      sendMemory: true,
      historyMessageCount: 4,
      compressMessageLengthThreshold: 1000,
      template: '1',
    },
    lang: 'zh-CN',
    builtin: false,
  } as Mask);

export const useMaskStore = createWithEqualityFn<MaskStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_MASK_STATE,
      create: async (mask) => {
        set(() => ({ globalMaskId: get().globalMaskId + 1 }));
        const id = get().globalMaskId;
        const masks = get().masks;
        masks[id] = {
          ...createEmptyMask(),
          ...mask,
          id,
          builtin: false,
        };
        set(() => ({ masks }));
        return masks[id];
      },
      createByServe: async (mask) => {
        set(() => ({ globalMaskId: get().globalMaskId + 1 }));
        const id = get().globalMaskId;
        const masks = get().masks;
        masks[id] = {
          ...createEmptyMask(),
          ...mask,
          id,
          builtin: false,
        };

        set(() => ({ masks }));

        await createMask({
          params: masks[id],
        });

        return masks[id];
      },
      update(id, updater) {
        const masks = get().masks;
        const mask = masks[id];
        if (!mask) return;
        const updateMaskObj = { ...mask };
        updater(updateMaskObj);
        updateMask({
          params: updateMaskObj,
        }).then(() => {
          masks[id] = updateMaskObj;
          set(() => ({ masks }));
        });
      },
      delete(id) {
        const masks = get().masks;
        deleteMask({
          params: masks[id],
        }).then(() => {
          delete masks[id];
          set(() => ({ masks }));
        });
      },

      get(id) {
        return get().masks[id ?? 1145141919810];
      },
      getAll: () => {
        const userMasks = Object.values(get().masks).sort((a, b) => b?.id - a?.id);
        const buildinMasks = BUILTIN_MASKS.map(
          (m) =>
            ({
              ...m,
              modelConfig: {
                ...defaultModelConfig,
                ...m.modelConfig,
              },
            } as Mask),
        );
        return userMasks.concat(buildinMasks);
      },
      querySevereList: async () => {
        const masks = get().masks;
        const list = await queryMaskList({
          params: undefined,
        });
        list.forEach((m) => {
          masks[m.id] = m;
        });
        set(() => ({ masks }));
        return get().getAll();
      },
      search() {
        return Object.values(get().masks);
      },
    }),
    {
      name: StoreKey.Mask,
      version: 2,
    },
  ),
  shallow,
);
