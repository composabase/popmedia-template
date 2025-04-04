import { createModule } from "@composabase/sdk"

const popMedia = () => {
  const module = createModule('pop-media')

  module.union('AlbumAndMovieUnion', ['musicAlbum', 'moviesMovie'])

  module.query('findAlbumsAndMovies', {
    definition: {
      type: module.list(module.union('AlbumAndMovieUnion')).optional(),
      args: {
        take: module.int().optional(),
      }
    },
    resolver: 'albums-and-movies',
  })

  module.mutation('findOrCreateAlbum', {
    definition: {
      type: module.scalar('musicAlbum'),
      args: {
        artistName: module.string(),
        albumName: module.string(),
      },
    },
    resolver: 'find-add-album',
  })

  module.type('musicAlbum', {
    calculated: {
      definition: {
        selectionSet: `{
            name
            artist
          }`,
        type: module.string(),
      },
      resolver: 'calculated',
    },
  })

  module.type('moviesMovie', {
    imdb: {
      definition: {
        selectionSet: `{
          title
        }`,
        type: module.string(),
      },
      resolver: 'imdb',
    },
  })

  return module
}

export default popMedia()
