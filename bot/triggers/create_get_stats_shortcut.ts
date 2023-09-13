import type { Trigger } from 'https://deno.land/x/deno_slack_sdk@2.2.0/types.ts'
import {
  TriggerContextData,
  TriggerTypes,
} from 'https://deno.land/x/deno_slack_api@2.1.1/mod.ts'
import GetStatsInfoWorkflow from '../workflows/get_stats_info.ts'

const createDeleteLocationShortcut: Trigger<typeof GetStatsInfoWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: 'Get Stats',
  description: 'Get Stats from the database',
  workflow: `#/workflows/${GetStatsInfoWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
}

export default createDeleteLocationShortcut
