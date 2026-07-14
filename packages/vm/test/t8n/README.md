# SAVM T8NTool

T8NTool, or Transition Tool, is a tool used to "fill tests" by test runners, for instance <https://github.com/sila-chain/execution-spec-tests/>. These files take an input allocation (the pre-state), which contains the accounts (their balances, nonces, storage and code). It also provides an environment, which holds relevant data as current timestamp, previous block hashes, current gas limit, etc. Finally, it also provides a transactions file, which are the transactions to run on top of this pre-state and environment. It outputs the post-state and relevant other artifacts, such as tx receipts and their logs. Test fillers will take this output to generate relevant tests, such as Blockchain tests or State tests, which can then be directly ran in other clients, or using SilaJS `npm run test:blockchain` or `npm run test:state`.

## Using T8Ntool to fill `execution-spec-tests`

To fill `execution-spec-tests` (or write own tests, and test those against the monorepo), follow these steps:

1. Clone <https://github.com/sila-chain/execution-spec-tests/>.
2. Follow the installation steps: <https://github.com/sila-chain/execution-spec-tests?tab=readme-ov-file#quick-start>.

To fill tests, such as the SIP-1153 TSTORE/TLOAD tests, run:

- `fill -vv -x --fork SilaCancun tests/cancun/sip1153_tstore/ --savm-bin=../silajs-monorepo/packages/vm/test/t8n/silajs-t8ntool.sh`

Breaking down these arguments:

- `-vv`: Verbose output
- `-x`: Fail early if any of the test fillers fails
- `--fork`: Fork to fill for
- `--savm-bin`: relative/absolute path to t8ns `silajs-t8ntool.sh`

Optionally, it is also possible to add the `-k <TEST>` option which will only fill this certain test.

## Debugging T8NTool with `execution-spec-tests`

Sometimes it is unclear why a test fails, and one wants more verbose output (from the SilaJS side). To do so, raw output from `execution-spec-tests` can be dumped by adding the `savm-dump-dir=<DIR>` flag to the `fill` command above. This will output `stdout`, `stderr`, the raw output allocation and the raw results (logs, receipts, etc.) to the `savm-dump-dir`. Additionally, if traces are wanted in `stdout`, add the `--log` flag to `silajs-t8ntool.sh`, i.e. `tsx "$SCRIPT_DIR/launchT8N.ts" "$@" --log`.

This will produce small SAVM traces, like this:

```typescript
Processing new transaction...
{
  gasLeft: '9976184',
  stack: [],
  opName: 'CALLDATASIZE',
  depth: 0,
  address: '0x0000000000000000000000000000000000001000'
}
```

## Writing a test in execution-spec-test

This issue comment is a good reference to write tests, together with an example: <https://github.com/sila-chain/silajs-monorepo/issues/3666#issuecomment-2349611424>
