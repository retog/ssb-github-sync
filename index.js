import fs from 'fs'
import os from 'os'
import path from 'path'
import pull from 'pull-stream'
import repositoryIndex from './lib/RepositoryIndex.js'
import cloneRepositorioes from './lib/CloneRepositories.js'
import pushToGithub from './lib/PushToGithub.js'
import addGithubUri from './lib/AddGithubUri.js'

fs.mkdtemp(path.join(os.tmpdir(), 'ssb-github-'), (err, folder) => {
  if (err) throw err;
  pull(
    repositoryIndex(),
    pull.filter(r => r.name),
    cloneRepositorioes(folder), 
    addGithubUri('git@github.com:retog/'), 
    pushToGithub(), 
    pull.log())
});

