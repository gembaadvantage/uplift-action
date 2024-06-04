# Uplift Github Action

[![Build status](https://img.shields.io/github/actions/workflow/status/gembaadvantage/uplift-action/ci.yml?style=flat-square&logo=typescript)](https://github.com/gembaadvantage/uplift-action/actions?workflow=ci)
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](/LICENSE)
[![codecov](https://codecov.io/gh/gembaadvantage/uplift-action/branch/main/graph/badge.svg)](https://codecov.io/gh/gembaadvantage/uplift-action)

A Github Action for the [Uplift](https://github.com/gembaadvantage/uplift) semantic versioning tool.

## Basic Usage

Easily integrate uplift into your existing workflows, by using `v2` of the action:

```yaml
steps:
  - uses: actions/checkout@v4
    with:
      fetch-depth: 0

  - uses: gembaadvantage/uplift-action@v2
    with:
      args: release
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Triggering another Workflow

If you need uplift to trigger another workflow after it has tagged your repository, you will need to associate a custom personal access token with the `GITHUB_TOKEN`. This is by [design](https://docs.github.com/en/actions/reference/authentication-in-a-workflow#using-the-github_token-in-a-workflow).

```yaml
steps:
  - uses: actions/checkout@v4
    with:
      fetch-depth: 0
      token: ${{ secrets.GH_UPLIFT }}

  - uses: gembaadvantage/uplift-action@v2
    with:
      args: release
    env:
      GITHUB_TOKEN: ${{ secrets.GH_UPLIFT }}
```

### Inputs

Customisable inputs can be provided through the `with` keys:

| Name           | Required | Type    | Default  | Description                                                                            |
| -------------- | -------- | ------- | -------- | -------------------------------------------------------------------------------------- |
| `version`      | No       | String  | `latest` | The uplift version, see [available](https://github.com/gembaadvantage/uplift/releases) |
| `install-only` | No       | Boolean | `false`  | Set to true to install uplift and expose the binary on the current PATH                |
| `args`         | Yes      | String  |          | A list of arguments that are used when running Uplift                                  |
