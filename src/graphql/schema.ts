import { schema } from "@composabase/sdk"

import helloCustom from '@composabase/graphql/modules/hello-custom'
import popMedia from '@composabase/graphql/modules/pop-media'

schema.query('hello', {
  definition: {
    type: schema.string(),
    args: {
      name: schema.string().optional(),
      isImportant: schema.boolean().optional(),
    },
  },
  resolver: 'hello',
})

schema.modules([helloCustom, popMedia])

export default schema
