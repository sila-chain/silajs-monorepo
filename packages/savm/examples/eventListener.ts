import { createEVM } from '@silajs/savm'
import { createAddressFromString, hexToBytes } from '@silajs/util'

const main = async () => {
  const savm = await createEVM()

  savm.events.on('beforeMessage', (event) => {
    console.log('synchronous listener to beforeMessage', event)
  })
  savm.events.on('afterMessage', (event, resolve) => {
    console.log('asynchronous listener to beforeMessage', event)
    // we need to call resolve() to avoid the event listener hanging
    resolve?.()
  })
  const res = await savm.runCall({
    to: createAddressFromString('0x0000000000000000000000000000000000000000'),
    value: 0n,
    data: hexToBytes('0x6001'), // PUSH1 01 -- simple bytecode to push 1 onto the stack
  })
  console.log(res.execResult.executionGasUsed) // 0n
}

void main()
