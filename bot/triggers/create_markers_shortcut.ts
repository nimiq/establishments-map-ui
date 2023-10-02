import type { Trigger } from 'https://deno.land/x/deno_slack_sdk@2.2.0/types.ts'
import {
  TriggerContextData,
  TriggerTypes,
} from 'https://deno.land/x/deno_slack_api@2.1.1/mod.ts'
import PostMarkersWorkflow from '../workflows/post_markers.ts'

const PostMarkersShortcut: Trigger<typeof PostMarkersWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: 'Markers',
  description: 'Run the markers algorithm',
  workflow: `#/workflows/${PostMarkersWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
}

export default PostMarkersShortcut
