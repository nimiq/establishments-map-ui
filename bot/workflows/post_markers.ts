import {
  DefineWorkflow,
  Schema,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { SendContext } from '../functions/send_context.ts'
import { PostMarkers } from '../functions/post_markers.ts'

const PostMarkersWorkflow = DefineWorkflow({
  callback_id: 'post_markers_wf',
  title: 'Markers',
  description: 'Computes the markers for rendering',
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ['interactivity'],
  },
})

PostMarkersWorkflow.addStep(PostMarkers, {})

PostMarkersWorkflow.addStep(
  SendContext,
  {
    environment: 'Production',
    content: `:cryptomap: Crypto Map - Running markers algorithm :bubbles:. This may take a while. Started by <@${PostMarkersWorkflow.inputs.interactivity.interactor.id}>.`,
    type: 'other',
  },
)

export default PostMarkersWorkflow
