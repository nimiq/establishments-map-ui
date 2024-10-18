import {
  DefineWorkflow,
  Schema,
} from 'https://deno.land/x/deno_slack_sdk@2.7.0/mod.ts'
import { GetStats } from '../functions/get_stats.ts'
import { SendContext } from '../functions/send_context.ts'

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

const content = `:cryptomap: Crypto Map Statistics :bar_chart:

Message triggered by <@${GetStatsWorkflow.inputs.interactivity.interactor.id}>.

\`\`\`
${JSON.stringify(statsStep.outputs.stats, null, 2)}
\`\`\`
`

GetStatsWorkflow.addStep(
  SendContext,
  {
    environment: 'Production',
    type: 'other',
    content,
  },
)

export default GetStatsWorkflow
