import { App } from '@serverless-stack/resources'
import { RemixStack } from './RemixStack'

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
    srcPath: 'services',
    bundle: {
      format: 'esm',
    },
  })
  app.stack(RemixStack)
}
