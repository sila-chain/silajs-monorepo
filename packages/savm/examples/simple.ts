import { createEVM } from '@silajs/savm'
import { hexToBytes } from '@silajs/util'

const main = async () => {
  const savm = await createEVM()
  const res = await savm.runCode({ code: hexToBytes('0x6001') }) // PUSH1 01 -- simple bytecode to push 1 onto the stack
  console.log(res.executionGasUsed) // 3n
}

void main()
