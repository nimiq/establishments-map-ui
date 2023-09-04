import { Manifest } from 'deno-slack-sdk/mod.ts'
import CreateAddEstablishmenPlaceIdWorkflow from './workflows/create_add_establishment_with_place_id.ts'
import DeleteEstablishmentWorkflow from './workflows/delete_establishment.ts'
import GetEstablishmentInfoWorkflow from './workflows/get_establishment_info.ts'
import HandleCandidateWorkflow from './workflows/handle_candidate.ts'
import HandleIssueWorkflow from './workflows/handle_issue.ts'
import ShowHelpWorkflow from './workflows/show_help.ts'
import CreateAddEstablishmenRawWorkflow from './workflows/create_add_establishment_raw.ts'
import { EstablishmentType } from './types/establishments.ts'

export default Manifest({
  name: 'crypto-map-bot',
  description: 'A Slack bot for managing the Crypto Map',
  icon: 'assets/crypto-map-bot-logo.png',
  workflows: [
    CreateAddEstablishmenPlaceIdWorkflow,
    CreateAddEstablishmenRawWorkflow,
    DeleteEstablishmentWorkflow,
    GetEstablishmentInfoWorkflow,
    HandleCandidateWorkflow,
    HandleIssueWorkflow,
    ShowHelpWorkflow,
  ],
  outgoingDomains: [
    'www.google.com',
    'mycbdmurjytbdahjljoh.supabase.co',
  ],
  types: [EstablishmentType],
  botScopes: ['commands', 'chat:write', 'chat:write.public'],
})
