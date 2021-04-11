// Copyright (c) 2021 Gemba Advantage
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// in the Software without restriction, including without limitation the rights
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as installer from './github'

async function run(): Promise<void> {
  try {
    const version = core.getInput('version') || 'latest'
    const args = core.getInput('args')

    // Download and grab path to the binary
    const path = await installer.downloadUplift(version)

    core.info('🚀 Running uplift')
    await exec.exec(`${path} bump ${args}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
