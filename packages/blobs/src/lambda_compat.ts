import { base64Decode } from '@netlify/runtime-utils'

import { EnvironmentContext, setEnvironmentContext } from './environment.ts'
import type { LambdaEvent } from './types.ts'

interface BlobsEventData {
  token: string
  url: string
}

export const connectLambda = (event: LambdaEvent) => {
  const rawData = base64Decode(event.blobs)
  let data: BlobsEventData
  try {
    data = JSON.parse(rawData) as BlobsEventData
  } catch {
    // If JSON parsing fails, do not proceed to set environment context
    return
  }

  const environmentContext: EnvironmentContext = {
    deployID: event.headers['x-nf-deploy-id'],
    edgeURL: data.url,
    siteID: event.headers['x-nf-site-id'],
    token: data.token,
  }

  setEnvironmentContext(environmentContext)
}

