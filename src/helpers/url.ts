import { ChatMessage } from '@/types';
import { Compressor } from '@/utils/compass';
import { genChatMessages } from '@/utils/genChatMessages';

export const genShareMessagesUrl = (messages: ChatMessage[], systemRole?: string) => {
  const compassedMsg = genChatMessages({ messages, systemRole });

  return `/share?messages=${Compressor.compress(JSON.stringify(compassedMsg))}`;
};

export const genSystemRoleQuery = async (content: string) => {
  const x = { state: { systemRole: content } };
  const systemRole = await Compressor.compressAsync(JSON.stringify(x));
  return `#systemRole=${systemRole}`;
};
