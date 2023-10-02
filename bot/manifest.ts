import { Manifest } from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { LocationType } from './types/location.ts'
import CreateAddLocationPlaceIdWorkflow from './workflows/add_location_place_id.ts'
import CreateAddLocationRawWorkflow from './workflows/add_location_manually.ts'
import DeleteLocationWorkflow from './workflows/delete_location.ts'
import GetLocationInfoWorkflow from './workflows/get_location_info.ts'
import GetStatsWorkflow from './workflows/get_stats_info.ts'
import HandleIssueWorkflow from './workflows/handle_issue.ts'
import HandleCandidateWorkflow from './workflows/handle_candidate.ts'
import ShowHelpWorkflow from './workflows/show_help.ts'
import PostMarkersWorkflow from './workflows/post_markers.ts'

export default Manifest({
  name: 'crypto-map-bot',
  description: 'A Slack bot for managing the Crypto Map',
  icon: 'assets/crypto-map-bot-logo.png',
  workflows: [
    CreateAddLocationPlaceIdWorkflow,
    CreateAddLocationRawWorkflow,
    GetStatsWorkflow,
    DeleteLocationWorkflow,
    GetLocationInfoWorkflow,
    HandleCandidateWorkflow,
    HandleIssueWorkflow,
    ShowHelpWorkflow,
    PostMarkersWorkflow,
  ],
  outgoingDomains: [
    'www.google.com',
    'mycbdmurjytbdahjljoh.supabase.co',
  ],
  types: [LocationType],
  botScopes: ['commands', 'chat:write', 'chat:write.public'],
})
