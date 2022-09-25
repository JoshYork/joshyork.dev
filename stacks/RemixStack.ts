import { RemixSite, StackContext } from "@serverless-stack/resources"

export const RemixStack = ({ stack, app }: StackContext) => {
  const site = new RemixSite(stack, "Site", {
    path: "remix/",
    ...(app.stage === "prod" ? { customDomain: "joshyork.dev" } : {}),
  })
  stack.addOutputs({
    URL: site.url,
  })
}
