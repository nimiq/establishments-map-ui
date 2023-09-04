import type { Trigger } from 'deno-slack-api/types.ts'
import { TriggerTypes } from 'deno-slack-api/mod.ts'
import type HandleIssueWorkflow from '../workflows/handle_issue.ts'

const trigger: Trigger<typeof HandleIssueWorkflow.definition> = {
  type: TriggerTypes.Webhook,
  name: 'Handle Issue',
  description:
    'Sends a message in the notification channel with the new candidate info and asks for verification',
  workflow: '#/workflows/handle_issue',
  inputs: {
    uuid: {
      value: '{{data.uuid}}',
    },
    captcha: {
      value: '{{data.captcha}}',
    },
    reason: {
      value: '{{data.reason}}',
    },
    reason_id: {
      value: '{{data.reason_id}}',
    },
    dev: {
      value: '{{data.dev}}',
    },
  },
}

export default trigger
