import type { Trigger } from 'https://deno.land/x/deno_slack_sdk@2.2.0/types.ts'
import {
  TriggerContextData,
  TriggerTypes,
} from 'https://deno.land/x/deno_slack_api@2.1.1/mod.ts'
import CreateAddLocationRawWorkflow from '../workflows/add_location_manually.ts'

const createNewLocationWithPlaceIdShortcut: Trigger<
  typeof CreateAddLocationRawWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: 'Add manually',
  description: 'Create a new Location with manual data',
  workflow:
    `#/workflows/${CreateAddLocationRawWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
}

export default createNewLocationWithPlaceIdShortcut
