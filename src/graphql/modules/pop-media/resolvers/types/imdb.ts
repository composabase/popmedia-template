import type { ResolverProps } from '@composabase/sdk'

export default async function Resolver({ root }: ResolverProps) {
  const { title } = root

  return `Use movie: ${title} to query IMDB API`
}
