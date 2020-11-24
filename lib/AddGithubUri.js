import pull from 'pull-stream'
import path from 'path'

export default function addGithubUri(baseUri) {
  return pull.asyncMap((repo,cb) => {
    const uri = path.join(baseUri, repo.name)
    repo.githubUri = uri
    cb(null, repo)
  })
}