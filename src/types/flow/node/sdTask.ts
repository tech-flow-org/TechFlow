export type SDTaskType = {
  model: string;
  size: 'landing' | 'avatar' | '4:3';
  mode: string;
  prompt: string;
  output?: string;
  width: number;
  height: number;
};
