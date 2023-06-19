import { AITaskContent, OutputNodeContent } from '@/types/flow';
import { BasicFlowNodeProps } from 'kitchen-flow-editor';

export type AITaskNodeProps = BasicFlowNodeProps<AITaskContent>;

export type StringNodeProps = BasicFlowNodeProps<string>;

export type OutputNodeProps = BasicFlowNodeProps<OutputNodeContent>;
