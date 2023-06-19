import { ChatAgent, ChatContext, ChatMessage, LLMModel } from '@/types';
import { ChatSessionState } from '@/types/sessions';
import type { Migration, MigrationData } from '@/utils/VersionController';
import { Md5 } from 'ts-md5';
import { v4 as uuid } from 'uuid';

export interface OldChatContext {
  model: string;
  systemRole: string;
  messages: ChatMessage[];
  title?: string;
  description?: string;
}

export interface OldSession {
  id: string;
  chat: OldChatContext;
}

/**
 * 本次版本升级将会调整 systemRole、Session 的数据结构
 */
export class MigrationV1ToV2 implements Migration {
  /***
   * 配置项里的当前版本号
   */
  version = 1;

  migrate(data: MigrationData<{ sessions: OldSession[] }>): MigrationData<ChatSessionState> {
    const agents: ChatSessionState['agents'] = {};
    const chats: ChatSessionState['chats'] = {};

    const { sessions, ...res } = data.state;

    // V1 中会有 settings，而 v0 中没有 settings
    sessions.forEach((session) => {
      const { chat, id } = session;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { systemRole, model: _, ...newChat } = chat;

      let chatAgentId: string | undefined = undefined;
      // 有 systemRole 的话做一轮处理
      if (systemRole) {
        const hash = Md5.hashStr(systemRole);
        let agent = Object.values(agents).find((a) => a.hash === hash);
        if (!agent) {
          const agentId = uuid();
          // 创建新的智能体
          const timestamp = Date.now();

          agent = {
            content: systemRole,
            hash,
            id: agentId,
            model: LLMModel.GPT3_5,
            updateAt: timestamp,
            createAt: timestamp,
          } as ChatAgent;

          agents[agentId] = agent;
        }
        chatAgentId = agent.id;
      }

      const timestamp = Date.now();

      chats[id] = {
        createAt: timestamp,
        updateAt: timestamp,
        ...newChat,
        id,
        agentId: chatAgentId,
      } as ChatContext;
    });

    return {
      state: { ...res, agents: agents, chats },
      version: data.version,
    };
  }
}
