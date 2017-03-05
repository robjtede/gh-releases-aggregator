'use strict'

const config = require('../config.json')

const Github = require('github')
const gh = new Github({
  debug: false,
  protocol: 'https',
  host: 'api.github.com',
  headers: {
    'user-agent': 'robjtede:gh-releases-aggregator'
  },
  Promise: Promise,
  followRedirects: false,
  timeout: 5000
})

gh.authenticate({
  type: 'oauth',
  token: config.GITHUB_API_KEY
})

gh.activity
  .getStarredReposForUser({
    username: 'robjtede',
    sort: 'updated',
    direction: 'desc',
    per_page: 100
  })
  .then(res => res.data)
  .then(repos => Promise.all([repos, ...repos.map(repo => {
    return gh.repos.getReleases({
      owner: repo.owner.login,
      repo: repo.name,
      per_page: 30
    })
  })]))
  .then(([repos, ...releases]) => [repos, releases.map(release => release.data)])
  .then(([repos, releases]) => repos.map((repo, i) => {
    repo.releases = releases[i]
    return repo
  }))
  .then(repos => repos.filter(repo => repo.releases.length > 0))
  .then(repos => {
    console.log(repos.map(repo => {
      return {
        name: repo.full_name,
        releases: repo.releases.map(release => release.tag_name)
      }
    }))
  })
  .catch(err => {
    console.error(err)
    throw err
  })

// gh.repos
//   .getReleases({
//     owner: 'HackSheffield',
//     repo: '2016f.hacksheffield.co',
//     per_page: 30
//   })
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => {
//     console.error(err)
//     throw err
//   })
