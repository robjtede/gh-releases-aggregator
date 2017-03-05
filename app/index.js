'use strict'

const config = require('../config.json')

const Github = require('github')
const marked = require('marked')

marked.setOptions({
  breaks: true,
  sanitize: true,
  smartypants: false
})

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

const data = JSON.parse(localStorage.getItem('releases'))

// gh.activity
//   .getStarredReposForUser({
//     username: 'robjtede',
//     sort: 'updated',
//     direction: 'desc',
//     per_page: 20
//   })
//   .then(res => res.data)
//   .then(repos => Promise.all([repos, ...repos.map(repo => {
//     return gh.repos.getReleases({
//       owner: repo.owner.login,
//       repo: repo.name,
//       per_page: 10
//     })
//   })]))
//   .then(([repos, ...releases]) => [repos, releases.map(release => release.data)])
//   .then(([repos, releases]) => repos.map((repo, i) => {
//     repo.releases = releases[i]
//     return repo
//   }))
//   .then(repos => repos.filter(repo => repo.releases.length > 0))
//   .then(repos => {
//     const stringified = JSON.stringify(repos)
//     if (stringified !== localStorage.getItem('releases')) {
//       localStorage.setItem('releases', stringified)
//       console.log('updated', repos)
//     }
//     return repos
//   })
//   .catch(err => {
//     console.error(err)
//     throw err
//   })

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

console.log(data)

document.addEventListener('DOMContentLoaded', () => {
  data.forEach(repo => {
    const $repo = document.createElement('section')
    $repo.classList.add('repo')

    // create elements for other things
    const $owner = document.createElement('p')
    $owner.classList.add('owner')
    $repo.appendChild($owner)

    const $name = document.createElement('h1')
    $name.classList.add('name')
    $repo.appendChild($name)

    const $description = document.createElement('p')
    $description.classList.add('description')
    $repo.appendChild($description)

    const $version = document.createElement('p')
    $version.classList.add('version')
    $repo.appendChild($version)

    const $changelog = document.createElement('p')
    $changelog.classList.add('changelog')
    $repo.appendChild($changelog)

    // populate elements
    $owner.textContent = repo.owner.login
    $name.textContent = repo.name
    $description.textContent = repo.description

    $version.textContent = repo.releases.length > 0
      ? repo.releases[0].name || repo.releases[0].tag_name
      : 'Unknown'

    $changelog.innerHTML = repo.releases.length > 0
      ? marked(repo.releases[0].body)
      : 'Look in master/Changelog.md or something'

    // add $repo to DOM
    document.querySelector('main').appendChild($repo)
  })
})
//
// window.addEventListener('scroll', ev => {
//   const $footer = document.querySelector('footer')
//
//   if ($footer.getBoundingClientRect().top - window.innerHeight < 0) {
//     // loadMore()
//   }
// }, { passive: true })
