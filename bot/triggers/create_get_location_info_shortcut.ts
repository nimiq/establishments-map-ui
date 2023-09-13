import type { Trigger } from 'https://deno.land/x/deno_slack_sdk@2.2.0/types.ts'
import {
  TriggerContextData,
  TriggerTypes,
} from 'https://deno.land/x/deno_slack_api@2.1.1/mod.ts'
import GetLocationInfoWorkflow from '../workflows/get_location_info.ts'

const createDeleteLocationShortcut: Trigger<
  typeof GetLocationInfoWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: 'Get Location info',
  description: 'Get Location info with a uuid',
  workflow: `#/workflows/${GetLocationInfoWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
}

export default createDeleteLocationShortcut
