import { Application } from 'probot' // eslint-disable-line no-unused-vars

class ReleaseInfo{
  constructor(
    public name: string,
    public tag_name: string,
    public body: string,
    public draft: boolean,
    public prerelease: boolean,
  ){}
}

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

    app.log(context)
  })
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
