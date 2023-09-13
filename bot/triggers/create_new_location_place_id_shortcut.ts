import type { Trigger } from 'https://deno.land/x/deno_slack_sdk@2.2.0/types.ts'
import {
  TriggerContextData,
  TriggerTypes,
} from 'https://deno.land/x/deno_slack_api@2.1.1/mod.ts'
import CreateAddLocationPlaceIdWorkflow from '../workflows/add_location_place_id.ts'

const CreateNewLocationWithPlaceIdShortcut: Trigger<
  typeof CreateAddLocationPlaceIdWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: 'Add via Place ID',
  description: 'Create a new location given its Place ID',
  workflow:
    `#/workflows/${CreateAddLocationPlaceIdWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
}

export default CreateNewLocationWithPlaceIdShortcut
