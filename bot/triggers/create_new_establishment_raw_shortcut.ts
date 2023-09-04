import type { Trigger } from 'deno-slack-sdk/types.ts'
import { TriggerContextData, TriggerTypes } from 'deno-slack-api/mod.ts'
import CreateAddEstablishmenRawWorkflow from '../workflows/create_add_establishment_raw.ts'

const createNewEstablishmentWithPlaceIdShortcut: Trigger<
  typeof CreateAddEstablishmenRawWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: 'Add manually',
  description: 'Create a new establishment with manual data',
  workflow:
    `#/workflows/${CreateAddEstablishmenRawWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
}

export default createNewEstablishmentWithPlaceIdShortcut
