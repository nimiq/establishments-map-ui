import type { Trigger } from 'deno-slack-sdk/types.ts'
import { TriggerContextData, TriggerTypes } from 'deno-slack-api/mod.ts'
import GetEstablishmentInfoWorkflow from '../workflows/get_establishment_info.ts'

const createDeleteEstablishmentShortcut: Trigger<
  typeof GetEstablishmentInfoWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: 'Get establishment info',
  description: 'Get establishment info with a uuid',
  workflow:
    `#/workflows/${GetEstablishmentInfoWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
}

export default createDeleteEstablishmentShortcut
