import type { ResolverProps } from '@composabase/sdk'
import { extractQueryFields } from '@composabase/sdk'
import { gql, client } from '@composabase/client'

export default async function Resolver({ operation, args }: ResolverProps) {
  const { artistName, albumName } = args
  const findManyGenre = gql(`query {
    music_subgraph {
      findManyGenre {
        name
      }
    }
  }`)

  const { data: genre_data } = await client.query(
    findManyGenre, 
    {}
  );
  const genres = genre_data.music_subgraph.findManyGenre.map((genre: any) => genre.name)
  const { genre, year } = {
    genre: genres[Math.floor(Math.random() * genres.length)],
    year: Math.floor(Math.random() * (2024 - 1950 + 1)) + 1950,
  }
  const selectionSetFields = extractQueryFields(operation.selectionSet.typed)
  const query = gql(`
    query findFirstAlbum ($artistName: String!, $albumName: String!) {
      music_subgraph {
        findFirstAlbum(
          where: {
            artist: {equals: $artistName},
            name: {equals: $albumName}
          }
        ) {
          ${selectionSetFields}
        }
      }
    }
`)

  const { data: query_data, error: query_error } = await client.query(
    query,
    { artistName, albumName },
    {
      requestPolicy: 'network-only'
    }
  );

  if (query_error) {
    throw query_error
  }

  if (!query_data) {
    return []
  }

  const { music_subgraph: { findFirstAlbum } } = query_data

  if (findFirstAlbum) {
    return findFirstAlbum
  }

  const mutation = gql(`
    mutation createOneAlbum (
        $artistName: String!,
        $albumName: String!,
        $genre: String!,
        $year: Int!,
      ) {
      music_subgraph {
        createOneAlbum (data: {
          artist: $artistName,
          albumGenres: {
            create: {
              genre: {
                connect: {
                  name: $genre
                }
              }
            }
          }
          descriptors: "lorem, ipsum, dolor, sit, amet",
          numberOfRatings: 1,
          numberOfReviews: 1,
          rank: 5001,
          rating: 3.14,
          name: $albumName,
          year: $year,
        }) {
          id
          name
          rank
        }
      }
    }`)

  const { data: mutation_data, error: mutation_error } = await client.mutation(mutation, {
    artistName,
    albumName,
    genre,
    year,
  });

  if (mutation_error) {
    throw mutation_error
  }

  if (!mutation_data) {
    return []
  }

  const { music_subgraph: { createOneAlbum } } = mutation_data

  if (createOneAlbum) {
    return createOneAlbum
  }

  return createOneAlbum
}
