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

import * as exec from '@actions/exec'
import * as client from '@actions/http-client'
import * as fs from 'fs'
import * as github from '../src/github'

describe('Github download Uplift', () => {
  test('downloads the latest version', async () => {
    const path = await github.downloadUplift('latest')

    // Query github for the latest tag
    const http = new client.HttpClient('uplift-action-test')
    const tag = (
      await http.getJson<github.GithubTag>(
        'https://api.github.com/repos/gembaadvantage/uplift/releases/latest'
      )
    ).result
    if (!tag) {
      throw new Error('')
    }

    expect(fs.existsSync(path)).toBe(true)

    const actualVersion = await checkUpliftVersion(path)
    expect(actualVersion).toMatch(tag.tag_name)
  })

  test('downloads a specific version', async () => {
    const path = await github.downloadUplift('v0.1.1')

    expect(fs.existsSync(path)).toBe(true)

    const actualVersion = await checkUpliftVersion(path)
    expect(actualVersion).toMatch('v0.1.1')
  })

  test('throws error with unrecognised version', async () => {
    try {
      await github.downloadUplift('A.B.C')
    } catch (error) {
      const err = error as Error
      expect(err.message).toBe(
        "Cannot download uplift version 'A.B.C' from Github"
      )
    }
  })
})

const checkUpliftVersion = async (path: string): Promise<string> => {
  let stdout = ''

  await exec.exec(`${path} version --short`, [], {
    listeners: {
      stdout: (data: Buffer) => {
        stdout += data.toString()
      }
    }
  })

  return stdout
}
