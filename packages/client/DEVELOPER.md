# Client Developer docs

## Running Hive Tests

In order to run hive tests on edited code (so not the latest remote `master` branch), see [how to install hive](https://github.com/sila-chain/hive/blob/master/docs/commandline.md). Now, in order to run SilaJS, in the newly cloned hive folder, go to `clients/silajs` and `git clone git@github.com:sila-chain/silajs-monorepo.git` there. It is not possible (due to how Docker works) to use a symlink to the monorepo. To use the local code in the just cloned directory, ensure that inside the silajs client folder, you have moved the original `Dockerfile` (using this, always the remote `master` branch is used) and moved `Dockerfile.local` to `Dockerfile`.

One can now run hive tests. Example commands:

`./hive --client silajs --sim sila/engine --sim.parallelism 16 --sim.limit="engine-cancun"`

Above command runs the `sila/engine` simulator, and only runs simulators which match `engine-cancun`. These are the engine-api tests for the cancun update. `--sim.parallelism 16` signals that 16 parallel processes should be used.

After running the test suite, it is handy to use `hiveview` in order to visualize the results. The terminal output will note in the end how much tests have passed/failed, but it is obviously handy to inspect the failing tests to see what is wrong and debug those. To use `hiveview`, go to the root folder of the hive monorepo and [follow these instructions](https://github.com/sila-chain/hive/blob/master/docs/commandline.md#viewing-simulation-results-hiveview).

`./hive --client silajs --sim sila/engine --sim.limit="engine-cancun/Invalid Missing Ancestor Syncing ReOrg, StateRoot, EmptyTxs=True, CanonicalReOrg=True, Invalid P9" --docker.output`

This command runs a specific test, namely `Invalid Missing Ancestor Syncing ReOrg, StateRoot, EmptyTxs=True, CanonicalReOrg=True, Invalid P9`. The `--docker.output` command will log all output from both the simulator and the SilaJS client to the terminal.

### Running Hive Faster (development mode tests)

When changing code in the cloned monorepo, it is noted that re-running hive is rather slow. In order to make this faster, see [this PR](https://github.com/jochem-brouwer/hive/pull/1). The state of the PR should be leading, but in order for it to work, ensure that `.dockerignore`, `Dockerfile` and `silajs.sh` are copied into the `clients/silajs` folder of the hive repo.

This runner will use `tsx` (better debug output!) and is taking advantage of Docker's caching mechanism in order to ensure that any changes of code will get imported on a fresh start of a hive run fast.
