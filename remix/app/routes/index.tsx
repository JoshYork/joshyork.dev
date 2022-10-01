import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getEnvsFromSSM } from '~/server/env.server'
import type { LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async () => {
  const envs = await getEnvsFromSSM({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    name: process.env.APP_NAME!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    stage: process.env.APP_STAGE!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    region: process.env.APP_REGION!,
  })

  console.log('done, envs', envs)
  return json({
    ENV: envs,
  })
}

const Index = () => {
  const data = useLoaderData()

  console.log('data', data)
  return (
    <div>
      <h1>Josh York</h1>
      <h2>Links</h2>
      {data.ENV.MESSAGE}
      <ul>
        <li>
          <a href="https://github.com/joshyork">GitHub</a>
        </li>
      </ul>
      <h2>Projects</h2>
      <ul>
        <li>
          <a href="https://github.com/joshyork/joshyork.dev">joshyork.dev</a>
        </li>
        <li>
          <a href="https://github.com/joshyork/dotfiles">Dotfiles</a>
        </li>
        <li>
          <a href="https://github.com/joshyork/raycast-bookmarks">
            Raycast extension: Bookmarks
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Index
