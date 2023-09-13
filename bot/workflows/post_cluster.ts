import {
  DefineWorkflow,
  Schema,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { SendContext } from '../functions/send_context.ts'
import { PostCluster } from '../functions/post_cluster.ts'

const PostClusterWorkflow = DefineWorkflow({
  callback_id: 'post_cluster_wf',
  title: 'Cluster',
  description: 'Computes the clusters for rendering',
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ['interactivity'],
  },
})

PostClusterWorkflow.addStep(PostCluster, {})

PostClusterWorkflow.addStep(
  SendContext,
  {
    environment: 'Production',
    content: `:cryptomap: Crypto Map - Running cluster algorithm :bubbles:. This may take a while. Started by <@${PostClusterWorkflow.inputs.interactivity.interactor.id}>.`,
    type: 'other',
  },
)

export default PostClusterWorkflow
