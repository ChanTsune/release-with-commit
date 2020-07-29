import { Application } from 'probot' // eslint-disable-line no-unused-vars
import { Config } from './config'

export = (app: Application) => {
  app.on('*', async context => {
    context.log({ event: context.event, action: context.payload.action })
  })

  app.on('issues.opened', async (context) => {
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
    await context.github.issues.createComment(issueComment)
  })
  app.on('push', async (context) => {
    const config = await context.config('auto-release.yml') as any
    if (!config){
      app.log('config not found!')
      return
    }
    const commits = context.payload.commits
    if (commits.length === 0) {
      app.log('No commits detected!')
      return
    }
    const headCommit = commits[0]
    const parsedConfig = Config.parse(config)
    if (!parsedConfig) {
      return
    }
    const releaseInfo = parsedConfig.exec(headCommit.message)
    if (!releaseInfo) {
      app.log('Commit message does not matched.')
      return
    }

    const release = context.repo(releaseInfo)
    await context.github.repos.createRelease(release)

    app.log(context)
  })
  app.on('pull_request.opened', async (context) => {
    // await context.github
    app.log("PR OPENED")
    app.log(context)
  })
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
