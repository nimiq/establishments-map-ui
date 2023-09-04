import type { Trigger } from 'deno-slack-sdk/types.ts'
import { TriggerContextData, TriggerTypes } from 'deno-slack-api/mod.ts'
import CreateAddEstablishmenPlaceIdWorkflow from '../workflows/create_add_establishment_with_place_id.ts'

const createNewEstablishmentWithPlaceIdShortcut: Trigger<
  typeof CreateAddEstablishmenPlaceIdWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: 'Add via Place ID',
  description: 'Create a new establishment given its Place ID',
  workflow:
    `#/workflows/${CreateAddEstablishmenPlaceIdWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
}

export default createNewEstablishmentWithPlaceIdShortcut
