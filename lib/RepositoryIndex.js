import SsbClient from 'ssb-client'
import pull from 'pull-stream'
import pullDefer from 'pull-defer'

export default function repositoryIndex () {
  return pull(repositoryMessages(), pull.map(logEntry => ({
    name: logEntry.value.content.name,
    uri: 'ssb://'+logEntry.key
  })))
}

function repositoryMessages () {
  const deferred = pullDefer.source()
  SsbClient((err, sbot) => {
    if (err) {
      console.log('could not get keys, got err', err);
    }
    else {
      const opts = {
        limit: 1000,
        reverse: true,
        query: [{
          $filter: {
            value: {
      "author": "@+qNos2XP9dfREX8qgNeA7V/KZPEYkRwreIuDqTWIqOI=.ed25519",
              content: {
                type: 'git-repo',
              }
            }
          }
        }]
      }
      const closingStream = pull(sbot.query.read(opts), function (read) {
        return function (abort, cb) {
          read(abort, function (end, data) {
            if(end) {
              //why cant we close immediately
              setTimeout(() => sbot.close(),1)
              return cb(end)
            }
            else cb(null, data)
          })
        }
      })
      deferred.resolve(closingStream)
    }
  })
  return deferred

}

