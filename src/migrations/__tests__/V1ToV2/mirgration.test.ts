import {
  MigrationV1ToV2,
  OldChatContext,
  OldSession,
} from '@/migrations/V1ToV2-RefactorSystemRole';
import { ChatSessionState, LLMModel } from '@/types';
import { VersionController } from '@/utils/VersionController';
import { Md5 } from 'ts-md5';
import { v4 as uuid } from 'uuid';

import { beforeEach, expect } from 'vitest';

function createOldSession(id: string, chat: OldChatContext): OldSession {
  return {
    id,
    chat,
  };
}

const Migration = new VersionController([MigrationV1ToV2], 2);

beforeEach(() => {
  vi.useFakeTimers({ now: 1234 });
});

// 测试构造对话： https://sharegpt.com/c/7OrdW9J
describe('MigrationV1ToV2: 迁移重构SystemRole', () => {
  test('1. 空输入数据', () => {
    const input: OldSession[] = [];
    const expectedOutput: ChatSessionState = {
      agents: {},
      chats: {},
    };

    const migrated = Migration.migrate({ state: { sessions: input }, version: 1 });
    expect(migrated).toEqual({ state: expectedOutput, version: 2 });
  });

  test('2. Single session without systemRole', () => {
    const sessionId = uuid();
    const data = {
      state: {
        sessions: [createOldSession(sessionId, { model: 'Model A', systemRole: '', messages: [] })],
      },
      version: 1,
    };

    const result = Migration.migrate(data);

    const expectedResult: ChatSessionState = {
      agents: {},
      chats: {
        [sessionId]: { messages: [], id: sessionId, createAt: 1234, updateAt: 1234 },
      },
    };

    expect(result).toEqual({
      state: expectedResult,
      version: 2,
    });
  });

  test('3. Single session with systemRole', () => {
    const sessionId = uuid();
    const data = {
      state: {
        sessions: [
          createOldSession(sessionId, { model: 'Model A', systemRole: 'Role A', messages: [] }),
        ],
      },
      version: 1,
    };

    const result: any = Migration.migrate(data);
    const agentId = Object.keys(result.state.agents)[0];

    const expectedResult: ChatSessionState = {
      agents: {
        [agentId]: {
          content: 'Role A',
          hash: Md5.hashStr('Role A'),
          id: agentId,
          createAt: 1234,
          model: LLMModel.GPT3_5,
          updateAt: 1234,
        },
      },
      chats: {
        [sessionId]: { id: sessionId, messages: [], agentId, createAt: 1234, updateAt: 1234 },
      },
    };

    expect(result).toEqual({ state: expectedResult, version: 2 });
  });

  test('4. Multiple sessions with different systemRole', () => {
    const sessionIds = [uuid(), uuid()];
    const data = {
      state: {
        sessions: [
          createOldSession(sessionIds[0], { model: 'Model A', systemRole: 'Role A', messages: [] }),
          createOldSession(sessionIds[1], { model: 'Model B', systemRole: 'Role B', messages: [] }),
        ],
      },
      version: 1,
    };

    const result: any = Migration.migrate(data);
    const agentIds = Object.keys(result.state.agents);

    expect(result.state.agents).toEqual({
      [agentIds[0]]: {
        content: 'Role A',
        createAt: 1234,
        hash: 'd86f1a3c54185d58dbb3f33bc854a7f3',
        id: agentIds[0],
        model: 'gpt-3.5-turbo',
        updateAt: 1234,
      },
      [agentIds[1]]: {
        content: 'Role B',
        createAt: 1234,
        id: agentIds[1],
        hash: 'b46a048521a4fc8e4ab3c0393053f9a8',
        model: 'gpt-3.5-turbo',
        updateAt: 1234,
      },
    });

    expect(result.state.chats).toEqual({
      [sessionIds[0]]: {
        agentId: agentIds[0],
        createAt: 1234,
        id: sessionIds[0],
        messages: [],
        updateAt: 1234,
      },
      [sessionIds[1]]: {
        agentId: agentIds[1],
        createAt: 1234,
        id: sessionIds[1],
        messages: [],
        updateAt: 1234,
      },
    });
  });

  test('5. Multiple sessions with same systemRole', () => {
    const sessionIds = [uuid(), uuid()];
    const data = {
      state: {
        sessions: [
          createOldSession(sessionIds[0], { model: 'Model A', systemRole: 'Role A', messages: [] }),
          createOldSession(sessionIds[1], { model: 'Model B', systemRole: 'Role A', messages: [] }),
        ],
      },
      version: 1,
    };

    const result: any = Migration.migrate(data);
    const agentId = Object.keys(result.state.agents)[0];

    expect(result.state.agents).toEqual({
      [agentId]: {
        content: 'Role A',
        createAt: 1234,
        hash: 'd86f1a3c54185d58dbb3f33bc854a7f3',
        id: agentId,
        model: 'gpt-3.5-turbo',
        updateAt: 1234,
      },
    });
    expect(result.state.chats).toEqual({
      [sessionIds[0]]: {
        agentId,
        createAt: 1234,
        id: sessionIds[0],
        messages: [],
        updateAt: 1234,
      },
      [sessionIds[1]]: {
        agentId,
        createAt: 1234,
        id: sessionIds[1],
        messages: [],
        updateAt: 1234,
      },
    });
  });

  test('6. Multiple sessions with partially same systemRole', () => {
    const sessionIds = [uuid(), uuid(), uuid()];
    const data = {
      state: {
        sessions: [
          createOldSession(sessionIds[0], { model: 'Model A', systemRole: 'Role A', messages: [] }),
          createOldSession(sessionIds[1], { model: 'Model B', systemRole: 'Role B', messages: [] }),
          createOldSession(sessionIds[2], { model: 'Model C', systemRole: 'Role A', messages: [] }),
        ],
      },
      version: 1,
    };

    const result: any = Migration.migrate(data);
    const agentIds = Object.keys(result.state.agents);

    expect(result.state.agents).toEqual({
      [agentIds[0]]: {
        content: 'Role A',
        createAt: 1234,
        hash: 'd86f1a3c54185d58dbb3f33bc854a7f3',
        id: agentIds[0],
        model: 'gpt-3.5-turbo',
        updateAt: 1234,
      },
      [agentIds[1]]: {
        content: 'Role B',
        createAt: 1234,
        hash: 'b46a048521a4fc8e4ab3c0393053f9a8',
        id: agentIds[1],
        model: 'gpt-3.5-turbo',
        updateAt: 1234,
      },
    });
    expect(result.state.chats).toEqual({
      [sessionIds[0]]: {
        agentId: agentIds[0],
        createAt: 1234,
        id: sessionIds[0],
        messages: [],
        updateAt: 1234,
      },
      [sessionIds[1]]: {
        agentId: agentIds[1],
        createAt: 1234,
        id: sessionIds[1],
        messages: [],
        updateAt: 1234,
      },
      [sessionIds[2]]: {
        agentId: agentIds[0],
        createAt: 1234,
        id: sessionIds[2],
        messages: [],
        updateAt: 1234,
      },
    });
  });
});
