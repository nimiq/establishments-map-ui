import type { Trigger } from 'https://deno.land/x/deno_slack_sdk@2.2.0/types.ts'
import {
  TriggerContextData,
  TriggerTypes,
} from 'https://deno.land/x/deno_slack_api@2.1.1/mod.ts'
import PostClusterWorkflow from '../workflows/post_cluster.ts'

const PostClusterShortcut: Trigger<typeof PostClusterWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: 'Cluster',
  description: 'Run the cluster algorithm',
  workflow: `#/workflows/${PostClusterWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
}

export default PostClusterShortcut
