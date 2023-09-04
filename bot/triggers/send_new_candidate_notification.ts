import type { Trigger } from 'deno-slack-api/types.ts'
import { TriggerTypes } from 'deno-slack-api/mod.ts'
import type HandleCandidateWorkflow from '../workflows/handle_candidate.ts'

const trigger: Trigger<typeof HandleCandidateWorkflow.definition> = {
  type: TriggerTypes.Webhook,
  name: 'Handle Candidate',
  description:
    'Sends a message in the notification channel with the new candidate info and asks for verification',
  workflow: '#/workflows/handle_candidate',
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
