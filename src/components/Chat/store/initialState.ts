import { initialAgent } from '@/store/session/initialState';
import { ChatAgent, ChatMessage, NewChatSession } from '@/types';
import { InternalChatContext } from '../types';

export interface ChatState extends InternalChatContext {
  /**
   * @title 消息
   * @type {string}
   */
  message: string;
  /**
   * @title 加载状态
   * @type {boolean}
   */
  loading: boolean;
  /**
   * @title 改变系统角色状态
   * @type {boolean}
   */
  changingSystemRole: boolean;
  /**
   * 编辑中的消息 id
   */
  editingMessageId?: number | null;
  onMessagesChange?: (messages: ChatMessage[]) => void;
  onResponseStart?: (messages: ChatMessage[]) => Promise<void>;
  onResponseFinished?: (session: NewChatSession) => void;
  onAgentChange?: (agent: ChatAgent, type: 'update' | 'remove') => void;
}

export const initialState: ChatState = {
  message: '',
  agent: initialAgent,
  messages: [],
  loading: false,
  changingSystemRole: false,
  editingMessageId: null,
  createAt: -1,
  updateAt: -1,
};
