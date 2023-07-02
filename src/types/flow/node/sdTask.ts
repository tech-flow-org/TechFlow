export type SDTaskType = {
  model?: string;
  size?: 'landing' | 'avatar' | '4:3';
  mode?: string;
  output?: string;
  width?: number;
  height?: number;
  hr_scale?: number;
  enable_hr?: boolean;
  negative_prompt?: string;
  prompt?: string;
};
