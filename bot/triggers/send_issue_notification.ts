import type { Trigger } from 'https://deno.land/x/deno_slack_sdk@2.2.0/types.ts'
import { TriggerTypes } from 'https://deno.land/x/deno_slack_api@2.1.1/mod.ts'
import HandleIssueWorkflow from '../workflows/handle_issue.ts'

const trigger: Trigger<typeof HandleIssueWorkflow.definition> = {
  type: TriggerTypes.Webhook,
  name: 'Handle Issue',
  description:
    'Sends a message in the notification channel with the new candidate info and asks for verification',
  workflow: `#/workflows/${HandleIssueWorkflow.definition.callback_id}`,
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
