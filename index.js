import fs from 'fs'
import os from 'os'
import path from 'path'
import pull from 'pull-stream'
import repositoryIndex from './lib/RepositoryIndex.js'
import cloneRepositorioes from './lib/CloneRepositories.js'
import pushToGithub from './lib/PushToGithub.js'

fs.mkdtemp(path.join(os.tmpdir(), 'ssb-github-'), (err, folder) => {
  if (err) throw err;
  pull(repositoryIndex(), cloneRepositorioes(folder), pushToGithub('git@github.com:retog/'), pull.log())
});

