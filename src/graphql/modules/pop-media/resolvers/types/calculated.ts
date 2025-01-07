import type { ResolverProps } from '@composabase/sdk'

export default async function Resolver({ root }: ResolverProps) {
  const { name, artist } = root

  return `Use album: ${name}, and artist: ${artist}. To fetch data from external API`
}
