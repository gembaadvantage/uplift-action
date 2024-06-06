import * as core from '@actions/core'
import * as client from '@actions/http-client'
import * as cache from '@actions/tool-cache'
import * as os from 'os'
import * as path from 'path'

const osPlatform = os.platform() as string
const osArch = os.arch()

export interface GithubTag {
  tag_name: string
}

export async function downloadUplift(version: string): Promise<string> {
  core.info(`🔍 searching Github for uplift version: ${version}`)
  const result = await queryVersion(version)
  if (!result) {
    throw new Error(`Cannot download uplift version '${version}' from Github`)
  }
  core.info(`✅ uplift version found: ${result.tag_name}`)

  // Having verified the version. Download it.
  const filename = getFilename(result.tag_name)

  core.info(`⬇️ downloading uplift version: ${result.tag_name}`)
  const toolPath = await cache.downloadTool(
    `https://github.com/gembaadvantage/uplift/releases/download/${result.tag_name}/${filename}`
  )

  // Unpack and cache the binary
  core.info('📦 extracting uplift binary from package')
  const extractPath = await cache.extractTar(toolPath)
  core.debug(`📁 extracted to: ${extractPath}`)

  const cachePath = await cache.cacheDir(
    extractPath,
    'uplift',
    result.tag_name.replace('/^v/', '')
  )
  core.debug(`🗄️ uplift binary cached at: ${cachePath}`)

  return path.join(cachePath, 'uplift')
}

const queryVersion = async (version: string): Promise<GithubTag | null> => {
  let url = ''

  if (version === 'latest') {
    url = 'https://api.github.com/repos/gembaadvantage/uplift/releases/latest'
  } else {
    url = `https://api.github.com/repos/gembaadvantage/uplift/releases/tags/${version}`
  }
  core.debug(`🌐 identified Github URL for download: ${url}`)

  const http = new client.HttpClient('uplift-action')

  return (await http.getJson<GithubTag>(url)).result
}

const getFilename = (version: string): string => {
  // Map the arch to supported values within the github release artifacts
  let arch = ''
  switch (osArch) {
    case 'x64':
      arch = 'x86_64'
      break
    case 'ppc64':
      arch = 'ppc64le'
      break
    default:
      arch = osArch
  }

  return `uplift_${version.replace(/^v/, '')}_${osPlatform}-${arch}.tar.gz`
}
