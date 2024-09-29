import * as path from 'node:path'
import { generateApi } from 'swagger-typescript-api'

generateApi({
  name: 'Api.ts',
  output: path.resolve(process.cwd(), './composables/generated'),
  url: 'http://localhost:8080/docs/json',
  unwrapResponseData: true,
  primitiveTypeConstructs: struct => ({
    ...struct,
    string: {
      ...struct.string
      /* "date-time": () => "Date",
            time: () => "Date",
            date: () => "Date", */
    }
  })
})
