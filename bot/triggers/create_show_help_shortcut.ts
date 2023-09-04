import { TriggerContextData, TriggerTypes } from 'deno-slack-api/mod.ts'
import type { Trigger } from 'deno-slack-sdk/types.ts'
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
