import type { Trigger } from 'deno-slack-sdk/types.ts'
import { TriggerContextData, TriggerTypes } from 'deno-slack-api/mod.ts'
import DeleteEstablishmenWorkflow from '../workflows/delete_establishment.ts'

const createDeleteEstablishmentShortcut: Trigger<
  typeof DeleteEstablishmenWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: 'Delete establishment',
  description: 'Delete establishment with a uuid',
  workflow: `#/workflows/${DeleteEstablishmenWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
}

export default createDeleteEstablishmentShortcut
