import { createEVM } from '@silajs/savm'
import { RPCBlockChain, RPCStateManager } from '@silajs/statemanager'

const main = async () => {
  try {
    const provider = 'https://path.to.my.provider.com'
    const blockchain = new RPCBlockChain(provider)
    const blockTag = 1n
    const state = new RPCStateManager({ provider, blockTag })
    const savm = await createEVM({ blockchain, stateManager: state }) // note that savm is ready to run BLOCKHASH opcodes (over RPC)
  } catch (e) {
    console.log(e.message) // fetch would fail because provider url is not real. please replace provider with a valid RPC url string.
  }
}
void main()
