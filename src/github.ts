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

import * as client from "@actions/http-client";
import * as cache from "@actions/tool-cache";
import * as os from "os";
import * as path from "path";

const osPlatform = os.platform() as string;
const osArch = os.arch();

interface GithubTag {
  tag_name: string;
}

export async function downloadUplift(version: string): Promise<string> {
  const result = await queryVersion(version);
  if (!result) {
    throw new Error(`Cannot download uplift version '${version}' from Github`);
  }

  // Having verified the version. Download it.
  const filename = getFilename(result.tag_name);
  const toolPath = await cache.downloadTool(
    `https://github.com/goreleaser/goreleaser/releases/download/${result.tag_name}/${filename}`
  );

  // Unpack and cache the binary
  const extractPath = await cache.extractTar(toolPath);
  const cachePath = await cache.cacheDir(
    extractPath,
    "uplift",
    result.tag_name.replace("/^v/", "")
  );

  return path.join(cachePath, "uplift");
}

const queryVersion = async (version: string): Promise<GithubTag | null> => {
  let url = "";

  if (version === "latest") {
    url = "https://api.github.com/repos/gembaadvantage/uplift/releases/latest";
  } else {
    url = `https://api.github.com/repos/gembaadvantage/uplift/releases/tags/${version}`;
  }

  const http = new client.HttpClient("uplift-action");

  return (await http.getJson<GithubTag>(url)).result;
};

const getFilename = (version: string): string => {
  // Map the arch to supported values within the github release artifacts
  let arch = "";
  switch (osArch) {
    case "x64":
      arch = "x86_64";
      break;
    case "ppc64":
      arch = "ppc64le";
      break;
    default:
      arch = osArch;
  }

  return `uplift_${version.replace(/^v/, "")}_${osPlatform}-${arch}.tar.gz`;
};
