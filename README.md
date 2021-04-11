# Uplift Github Action

[![Build status](https://img.shields.io/github/workflow/status/gembaadvantage/uplift-action/ci?style=flat-square&logo=typescript)](https://github.com/gembaadvantage/uplift-action/actions?workflow=ci)
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](/LICENSE)
[![codecov](https://codecov.io/gh/gembaadvantage/uplift-action/branch/main/graph/badge.svg)](https://codecov.io/gh/gembaadvantage/uplift-action)

A Github Action for the [Uplift](https://github.com/gembaadvantage/uplift) semantic versioning tool.

## Usage

Easily integrate uplift into your existing workflows, by using the `@v1` of the action:

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: gembaadvantage/uplift-action@v1
    with:
      version: latest
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

Customisable inputs can be provided through the use of the `step.with` keys:

| Name    | Type   | Default  | Description                                                                            |
| ------- | ------ | -------- | -------------------------------------------------------------------------------------- |
| version | String | `latest` | The uplift version, see [available](https://github.com/gembaadvantage/uplift/releases) |
| args    | String |          | Command line arguments to pass to uplift                                               |
