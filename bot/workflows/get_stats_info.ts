import {
  DefineWorkflow,
  Schema,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { SendContext } from '../functions/send_context.ts'
import { GetStats } from '../functions/get_stats.ts'

const GetStatsWorkflow = DefineWorkflow({
  callback_id: 'get_stats_wf',
  title: 'Get stats',
  description: 'Get stats from the database',
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ['interactivity'],
  },
})

const statsStep = GetStatsWorkflow.addStep(
  GetStats,
  { environment: 'Production' },
)

GetStatsWorkflow.addStep(
  SendContext,
  {
    stats: statsStep.outputs.stats,
    environment: 'Production',
    reviewer: GetStatsWorkflow.inputs.interactivity.interactor.id,
    type: 'stats',
  },
)

export default GetStatsWorkflow
