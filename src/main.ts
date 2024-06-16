import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {dirname} from 'path'
import * as installer from './github'

async function run(): Promise<void> {
  try {
    const version = core.getInput('version') || 'latest'
    const installOnly = core.getBooleanInput('install-only') || false
    const args = core.getInput('args')

    // Arguments must be passed for Uplift to run
    if (!args) {
      core.setFailed('args input for action is required')
      return
    }

    // Download and grab path to the binary
    const path = await installer.downloadUplift(version)

    if (installOnly === true) {
      const binaryDir = dirname(path)
      core.addPath(binaryDir)
      core.info('🚀 Successfully added Uplift to PATH')
      return
    }

    core.info('🚀 Running uplift')
    await exec.exec(`${path} ${args}`)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
