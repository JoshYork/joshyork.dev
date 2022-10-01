import { A, O, R, S, pipe } from '@typedash/typedash'
import AWS from 'aws-sdk'
import type { Parameter } from 'aws-sdk/clients/ssm'

const getAllParametersByPath = async ({
  ssm,
  path,
  params = [],
  nextToken,
}: {
  ssm: AWS.SSM
  path: string
  params?: Array<Parameter>
  nextToken?: string
}): Promise<Array<Parameter>> => {
  const response = await ssm
    .getParametersByPath({
      Path: path,
      WithDecryption: true,
      NextToken: nextToken,
    })
    .promise()

  if (response.NextToken && response.Parameters) {
    return getAllParametersByPath({
      ssm,
      path,
      params: params.concat(response.Parameters),
      nextToken: response.NextToken,
    })
  }

  return params.concat(response.Parameters || [])
}

export const getEnvsFromSSM = async ({
  name,
  stage,
  region,
}: {
  name: string
  stage: string
  region: string
}) => {
  console.log('getting env vars', { name, stage, region })
  const ssm = new AWS.SSM({ region: region })
  const [fallbackParamsResponse, stageParamsResponse] = await Promise.all([
    getAllParametersByPath({ ssm, path: `/sst/${name}/.fallback/secrets` }),
    getAllParametersByPath({
      ssm,
      path: `/sst/${name}/${stage}/secrets`,
    }),
  ])

  return pipe(
    [fallbackParamsResponse, stageParamsResponse],
    A.map(
      A.reduce<Parameter, Record<string, string>>({}, (acc, param) => {
        const key = pipe(
          param.Name,
          O.fromNullable,
          O.map((x) => x.split('/')),
          O.chain(A.last),
          O.getOrElse(() => 'UNKNOWN_KEY'),
        )
        acc[key] = param.Value || 'unknownValue'
        return acc
      }),
    ),
    ([fallbackParams, stageParams]) =>
      R.mergeDeepRight(fallbackParams, stageParams),
  )
}
