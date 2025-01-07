import type { ResolverProps } from '@composabase/sdk'
import { extractFragment } from '@composabase/sdk'
import { gql, client } from '@composabase/client'

export default async function Resolver({ operation, args }: ResolverProps) {
  const { take = 2 } = args
  const albumFragment = extractFragment(operation.selectionSet.typed, 'music_Album')
  const movieFragment = extractFragment(operation.selectionSet.typed, 'movies_Movie')

  const query = gql(`
    ${albumFragment}
    ${movieFragment}
    query findAlbumsAndMovies ($take: Int!) {
      music_subgraph {
        findManyAlbum (take: $take, orderBy: [{rank:asc}]) {
          ...music_AlbumFragment
        }
      }
      movies_subgraph {
        findManyMovie (take: $take, orderBy: [{rank:asc}]) {
          ...movies_MovieFragment
        }
      }
    }
  `)

  const { data, error } = await client.query(query, { take });

  if (error) {
    throw error
  }

  if (!data) {
    return []
  }

  const { music_subgraph: { findManyAlbum }, movies_subgraph: { findManyMovie } } = data

  return [...findManyAlbum, ...findManyMovie]
}
