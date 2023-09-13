import type { Trigger } from 'https://deno.land/x/deno_slack_sdk@2.2.0/types.ts'
import {
  TriggerContextData,
  TriggerTypes,
} from 'https://deno.land/x/deno_slack_api@2.1.1/mod.ts'
import ShowHelpWorkflow from '../workflows/show_help.ts'

const createShowHelpShortcut: Trigger<
  typeof ShowHelpWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: 'Help',
  description: 'Show help',
  workflow: `#/workflows/${ShowHelpWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
}

export default createShowHelpShortcut
