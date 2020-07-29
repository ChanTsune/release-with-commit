import { Config, PushHook } from '../src/config'
import yaml from 'js-yaml'

const fs = require('fs')
const path = require('path')

describe('Config', () => {
    let config: any

beforeAll(
    (done: Function) => {fs.readFile(
        path.join(__dirname, '../.github/auto-release.yml'),
        (err: Error, conf: string) => {
            if (err) return done(err)
            config = yaml.safeLoad(conf) || {}
            done()
        })
    })
    test('Config.parse', async (done) => {
        const parsedConfig = Config.parse(config)
        done(expect(parsedConfig.pushHooks.length).toBe(1))
    })
    test('PushHook.parse', async (done) => {
        const pushHook = PushHook.parse(config.pushHooks[0])
        done(expect(pushHook.releaseBodyTemplate).toBe("{3}"))
    })
    test('PushHook.exec', async (done) => {
        const pushHook = PushHook.parse(config.pushHooks[0])
        const result = pushHook.exec("Release 1.1.1\n\n- Add\n - function")
        done(expect(result).toBeTruthy())
    })
    test('PushHook.exec', async (done) => {
        const pushHook = PushHook.parse(config.pushHooks[0])
        const result = pushHook.exec('Release 1.1.1\n\n- Add\n - function')
        if (!result) done()
        const releaseInfo = pushHook.releaseInfo
        if (releaseInfo) {
          expect(releaseInfo.name).toBe('Release version 1.1.1')
          expect(releaseInfo.tag_name).toBe('v1.1.1')
          expect(releaseInfo.body).toBe('- Add\n - function')
        }
        done()
    })
})
