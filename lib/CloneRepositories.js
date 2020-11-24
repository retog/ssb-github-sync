import pull from 'pull-stream'
import pullDefer from 'pull-defer'
import {exec} from 'child_process'
import path from 'path'

export default function cloneRepositories(baseDir) {
  return pull.asyncMap((repo,cb) => {
    const checkout = path.join(baseDir,repo.name)
    const gitDir = path.join(checkout, '.git')
    exec(`cd ${baseDir} && git clone --mirror ${repo.uri} ${gitDir} && cd ${checkout}`+
          `&& git config --bool core.bare false && git checkout`+
          `git branch -a | sed -n "/\/HEAD /d; /\/master$/d; /remotes/p;" | xargs -L1 git checkout`, 
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
      repo.checkout = checkout
      cb(null, repo)
    })
  })
}