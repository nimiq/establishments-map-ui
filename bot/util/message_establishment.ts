import type { Establishment } from './types.ts'

type NewCandidate =
  & {
    type: 'new_candidate'
  }
  & Pick<
    Establishment,
    'name' | 'accepts' | 'gmaps' | 'gmaps_place_id' | 'facebook' | 'instagram'
  >

type NewIssue = {
  type: 'new_issue'
  crypto_map_domain: string
  reason_id: string
  reason: string
} & Establishment

type IgnoreIssue = Omit<NewIssue, 'type'> & {
  type: 'ignore_issue'
  reviewer: string
} & Establishment

type ApproveIssue = Omit<IgnoreIssue, 'type'> & {
  type: 'approve_issue'
}

type EstablishmentDeletedViaIssue = Omit<IgnoreIssue, 'type'> & {
  type: 'establishment_deleted_issue'
}

type ProcessedCandidate = Omit<NewCandidate, 'type'> & {
  type: 'approved' | 'rejected'
  reviewer: string
}

type AddedCandidate = Omit<ProcessedCandidate, 'type'> & {
  crypto_map_domain: string
  type: 'candidate_added'
} & Establishment

type AddedEstablishment = Omit<ProcessedCandidate, 'type'> & {
  crypto_map_domain: string
  type: 'establishment_added'
} & Establishment

type EstablishmentDeleted = {
  reviewer: string
  type: 'establishment_deleted'
} & Establishment

type GetEstablishment = {
  reviewer: string
  crypto_map_domain: string
  type: 'establishment_info'
} & Establishment

type Input =
  & { dev: boolean }
  & (
    | NewCandidate
    | IgnoreIssue
    | NewIssue
    | ProcessedCandidate
    | AddedCandidate
    | AddedEstablishment
    | EstablishmentDeleted
    | EstablishmentDeletedViaIssue
    | ApproveIssue
    | GetEstablishment
  )

function cryptosToEmoji(cryptos: string[] = []) {
  if (typeof cryptos.length === 'undefined')
    return ''
  return cryptos?.map(c =>
    `:${c.toLocaleLowerCase().replace('dash', 'dashh')}:`,
  ).join(' ') || ''
}

function getCryptoMapLink(name: string, domain: string, uuid: string) {
  return `See *${name}* in the <${domain}/?e=${uuid}|:cryptomap: Crypto Map>`
}

export function getMessageString(input: Input) {
  let pre = ''
  let dev = ''
  let reason = ''

  if (input.dev)
    dev = ':test_tube: *Test environment* :test_tube:\n'

  if ('reason' in input) {
    reason
      = `\n:new_moon_with_face: Reason of the issue: *${input.reason_id}*.\nThe user wrote: "_${input.reason}_"\n\n`
  }

  if (input.type === 'new_candidate') {
    pre = ':new: Candidate submitted.'
  }
  else if (input.type === 'new_issue') {
    pre = `:scream: Issue submitted. ${
      getCryptoMapLink(input.name, input.crypto_map_domain, input.uuid)
    }.`
  }
  else if (input.type === 'ignore_issue') {
    pre = `:unamused: Issue ignored by <@${input.reviewer}>. ${
      getCryptoMapLink(input.name, input.crypto_map_domain, input.uuid)
    }.`
  }
  else if (input.type === 'approve_issue') {
    pre
      = `:unamused: Deleting establishment from the database :thinking_face:... Triggered by <@${input.reviewer}>. ${
        getCryptoMapLink(input.name, input.crypto_map_domain, input.uuid)
      }.`
  }
  else if (input.type === 'establishment_deleted_issue') {
    pre
      = `:unamused: Deleted establishment from the database. Triggered by <@${input.reviewer}>.`
  }
  else if (input.type === 'approved') {
    pre
      = `Adding to the database... :thinking_face:\n\n:white_check_mark: Candidate approved by <@${input.reviewer}>.`
  }
  else if (input.type === 'rejected') {
    pre = `:x: Candidate rejected by <@${input.reviewer}>.`
  }
  else if (input.type === 'candidate_added') {
    pre = `:new: Added candidate. ${
      getCryptoMapLink(input.name, input.crypto_map_domain, input.uuid)
    }. Approved by <@${input.reviewer}>.`
  }
  else if (input.type === 'establishment_added') {
    pre = `:new: Added new establishment. ${
      getCryptoMapLink(input.name, input.crypto_map_domain, input.uuid)
    }. Added by <@${input.reviewer}>.`
  }
  else if (input.type === 'establishment_deleted') {
    pre
      = `:put_litter_in_its_place: Deleted establishment from the :cryptomap: Crypto Map. Triggered by <@${input.reviewer}>.`
  }
  else if (input.type === 'establishment_info') {
    pre = `:mag: ${
      getCryptoMapLink(input.name, input.crypto_map_domain, input.uuid)
    }.`
  }

  const buy = cryptosToEmoji(input.accepts)
  const name = `:point_right: ${input.name}`

  let text = `${dev}${reason}${pre}\n${name}\t\t${buy}\n`

  const url = input.gmaps || input.instagram || input.facebook
  if (url) {
    let socialMedia = `:selfie: \`${
      input.gmaps ? 'Google Maps' : input.instagram ? 'Instagram' : 'Facebook'
    }\``
    socialMedia += (input.gmaps_place_id ? ` (\`${input.gmaps_place_id}\`)` : '')
    const socialMediaLink = input.gmaps
      ? `:gmaps: <${url}|Google Maps>`
      : input.instagram
        ? `:camera_with_flash: <${url}|Instagram>`
        : `:blue_book: <${url}|Facebook>`
    text += `${socialMedia}\t\t${socialMediaLink}\n`
  }
  else if ('instagram' in input) {
    const instagram
      = `:camera_with_flash: <https://www.instagram.com/${input.instagram}|${input.instagram}>`
    text += `${instagram}\n`
  }
  else if ('facebook' in input) {
    const facebook
      = `:blue_book: <https://www.facebook.com/${input.facebook}|${input.facebook}>`
    text += `${facebook}\n`
  }

  if (
    input.type === 'candidate_added'
    || input.type === 'establishment_deleted'
    || input.type === 'establishment_added' || input.type === 'new_issue'
    || input.type === 'ignore_issue' || input.type === 'approve_issue'
    || input.type === 'establishment_deleted_issue'
    || input.type === 'establishment_info'
  ) {
    const address
      = `:round_pushpin: ${input.address} (\`${input.lat}, ${input.lng}\`)`
    const rating = `:star: ${input.rating?.toFixed(2)}`
    const category = `:diamond_shape_with_a_dot_inside: ${input.category} (${
      input.gmapstype?.join(', ')
    })`
    const provider = input.provider
      ? `:factory: Provider: ${input.provider}\t\t`
      : ''
    const uuid = `UUID: \`${input.uuid}\``
    text += `${address}\n${rating}\t\t${category}\n${provider}${uuid}\n`
    if (input.sells && input.sells.length > 0)
      text += `:moneybag: Sells: ${cryptosToEmoji(input.sells)}\n`

    if (!input.provider) {
      text
        += ':mega: *We don\'t have the crypto information about this establishment*.\n This means that it is shown in the Crypto Map, but there is no information about the cryptos that it accepts/sells nor the provider.\n> :bulb:*Consider removing this establishment from the Crypto Map using the `/delete` command*.'
    }
  }

  return text
}
