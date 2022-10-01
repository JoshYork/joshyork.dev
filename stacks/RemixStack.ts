import { RemixSite, StackContext } from '@serverless-stack/resources'

export const RemixStack = ({ stack, app }: StackContext) => {
  const site = new RemixSite(stack, 'Site', {
    path: 'remix/',
    ...(app.stage === 'prod' ? { customDomain: 'joshyork.dev' } : {}),
    environment: {
      APP_NAME: app.name,
      APP_STAGE: app.stage,
      APP_REGION: app.region,
    },
  })
  stack.addOutputs({
    URL: site.url,
  })
}
