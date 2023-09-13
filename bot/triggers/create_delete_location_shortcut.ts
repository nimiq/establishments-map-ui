import type { Trigger } from 'https://deno.land/x/deno_slack_sdk@2.2.0/types.ts'
import {
  TriggerContextData,
  TriggerTypes,
} from 'https://deno.land/x/deno_slack_api@2.1.1/mod.ts'
import DeleteLocationWorkflow from '../workflows/delete_location.ts'

const createDeleteLocationShortcut: Trigger<
  typeof DeleteLocationWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: 'Delete location',
  description: 'Delete location with a uuid',
  workflow: `#/workflows/${DeleteLocationWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
}

export default createDeleteLocationShortcut
