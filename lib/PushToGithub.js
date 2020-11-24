import pull from 'pull-stream'
import pullDefer from 'pull-defer'
import {exec} from 'child_process'

export default function pushToGithub(baseUri) {
  return pull.asyncMap((repo,cb) => {
    const uri = baseUri+repo.name
    exec(`cd ${repo.checkout} && git pull ${uri} && git push --all ${uri} && git push --all ${repo.uri}`, 
    (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`)
          return cb(error, null)
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`)
          //return cb(stderr, null)
      }
      repo.githubUri = uri
      cb(null, repo)
    })
  })
}