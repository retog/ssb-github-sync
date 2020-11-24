import pull from 'pull-stream'
import {exec} from 'child_process'

export default function pushToGithub(baseUri) {
  return pull.asyncMap((repo,cb) => {
    exec(`cd ${repo.checkout} && git push --all ${repo.githubUri}`, 
    (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`)
          return cb(error, null)
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`)
          //return cb(stderr, null)
      }
      if (stdout) {
        console.log(`stdout: ${stdout}`)
      }
      cb(null, repo)
    })
  })
}