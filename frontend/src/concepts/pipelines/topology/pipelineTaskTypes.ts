import { InputDefinitionParameterType, RuntimeStateKF } from '~/concepts/pipelines/kfTypes';
import { createNode } from '~/concepts/topology';

export type PipelineTaskParam = {
  label: string;
  type: InputDefinitionParameterType;
  value?: string;
};

export type PipelineTaskArtifact = {
  label: string;
  type: string;
};

export type PipelineTaskStep = {
  image: string;
  args?: string[];
  command?: string[];
  volume?: {
    mountPath: string;
  };
};

export type PipelineTaskInputOutput = {
  artifacts?: PipelineTaskArtifact[];
  params?: PipelineTaskParam[];
};

export type PipelineTaskRunStatus = {
  startTime: string;
  completeTime?: string;
  podName?: string;
  state?: RuntimeStateKF;
  taskId?: string;
};

export type PipelineTask = {
  type: 'artifact' | 'task' | 'groupTask';
  name: string;
  steps?: PipelineTaskStep[];
  inputs?: PipelineTaskInputOutput;
  outputs?: PipelineTaskInputOutput;
  /** Run Status */
  status?: PipelineTaskRunStatus;
};

export type KubeFlowTaskTopology = {
  /**
   * Details of a selected node.
   * [Task.name]: Task
   */
  taskMap: Record<string, PipelineTask | undefined>;
  /**
   * Nodes to render in topology.
   */
  nodes: ReturnType<typeof createNode>[];
};
