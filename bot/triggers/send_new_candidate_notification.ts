import type { Trigger } from 'https://deno.land/x/deno_slack_sdk@2.2.0/types.ts'
import { TriggerTypes } from 'https://deno.land/x/deno_slack_api@2.1.1/mod.ts'
import HandleCandidateWorkflow from '../workflows/handle_candidate.ts'

const trigger: Trigger<typeof HandleCandidateWorkflow.definition> = {
  type: TriggerTypes.Webhook,
  name: 'Handle Candidate',
  description:
    'Sends a message in the notification channel with the new candidate info and asks for verification',
  workflow: `#/workflows/${HandleCandidateWorkflow.definition.callback_id}`,
  inputs: {
    gmapsPlaceId: {
      value: '{{data.gmapsPlaceId}}',
    },
    captcha: {
      value: '{{data.captcha}}',
    },
    name: {
      value: '{{data.name}}',
    },
    currencies: {
      value: '{{data.currencies}}',
    },
    dev: {
      value: '{{data.dev}}',
    },
  },
}

export default trigger
