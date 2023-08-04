import { FileReadNodeContent, SymbolMasterDefinition } from '@/types/flow';

export const FileReadSymbol: SymbolMasterDefinition<FileReadNodeContent> = {
  id: 'file_read',
  title: '文件读取',
  avatar: '🗂️',
  description: '读取并扫描文件内容',
  defaultContent: {
    file: '',
    type: 'txt',
  },
  schema: {
    type: {
      type: 'input',
      title: '文件类型',
      valueContainer: false,
      component: 'Segmented',
      options: [
        {
          label: '文本',
          value: 'txt',
        },
        {
          label: 'PDF',
          value: 'pdf',
        },
        {
          label: 'CSV',
          value: 'csv',
        },
      ],
    },
    file: {
      type: 'input',
      valueContainer: false,
      component: 'Upload',
      title: '上传文件',
    },
  },
  run: async (node) => {
    return {
      type: 'text',
      output: node.file,
    };
  },
};
