import { bytesToHex } from '@silajs/util'

import { Config } from '../../index.ts'
import { RlpxPeer } from '../../net/peer/rlpxpeer.ts'
import { getClientVersion } from '../../util/index.ts'
import { INTERNAL_ERROR } from '../error-code.ts'
import { callWithStackTrace } from '../helpers.ts'
import { middleware, validators } from '../validation.ts'

import type { Chain } from '../../blockchain/index.ts'
import type { SilaClient } from '../../client.ts'
import type { RlpxServer } from '../../net/server/rlpxserver.ts'
import type { FullSilaService } from '../../service/index.ts'

/**
 * admin_* RPC module
 * @memberof module:rpc/modules
 */
export class Admin {
  readonly _chain: Chain
  readonly _client: SilaClient
  private _rpcDebug: boolean

  /**
   * Create admin_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: SilaClient, rpcDebug: boolean) {
    const service = client.service as FullSilaService
    this._chain = service.chain
    this._client = client
    this._rpcDebug = rpcDebug

    this.nodeInfo = callWithStackTrace(this.nodeInfo.bind(this), this._rpcDebug)
    this.peers = callWithStackTrace(this.peers.bind(this), this._rpcDebug)
    this.addPeer = middleware(callWithStackTrace(this.addPeer.bind(this), this._rpcDebug), 1, [
      [
        validators.object({
          address: validators.ipv4Address,
          udpPort: validators.unsignedInteger,
          tcpPort: validators.unsignedInteger,
        }),
      ],
    ])
  }

  /**
   * Returns information about the currently running node.
   * see for reference: https://geth.sila.org/docs/interacting-with-geth/rpc/ns-admin#admin_peers
   */
  async nodeInfo() {
    const rlpxInfo = this._client.config.server!.getRlpxInfo()
    const { enode, id, ip, listenAddr, ports } = rlpxInfo
    const { discovery, listener } = ports
    const clientName = getClientVersion()

    const latestHeader = this._chain.headers.latest!
    const difficulty = latestHeader.difficulty.toString()
    const genesis = bytesToHex(this._chain.genesis.hash())
    const head = bytesToHex(latestHeader.mixHash)
    const network = this._chain.chainId.toString()

    const nodeInfo = {
      name: clientName,
      enode,
      id,
      ip,
      listenAddr,
      ports: {
        discovery,
        listener,
      },
      protocols: {
        sil: {
          difficulty,
          genesis,
          head,
          network,
        },
      },
    }
    return nodeInfo
  }

  /**
   * Returns information about currently connected peers
   * @returns an array of objects containing information about peers (including id, sil protocol versions supported, client name, etc.)
   */
  async peers() {
    const peers = this._client.service!.pool.peers as RlpxPeer[]

    return peers?.map((peer) => {
      return {
        id: peer.id,
        name: peer.rlpxPeer?.['_hello']?.clientId ?? null,
        protocols: {
          sil: {
            head:
              peer.sil?.updatedBestHeader !== undefined
                ? bytesToHex(peer.sil.updatedBestHeader.hash())
                : bytesToHex(peer.sil?.status.bestHash ?? new Uint8Array()),
            difficulty: peer.sil?.status.td.toString(10),
            version: peer.sil?.['versions'].slice(-1)[0] ?? null,
          },
        },
        caps: peer.sil?.['versions'].map((ver) => 'sil/' + ver),
        network: {
          remoteAddress: peer.address,
        },
      }
    })
  }

  /**
   * Attempts to add a peer to client service peer pool using the RLPx server address and port
   * e.g. `.admin_addPeer [{"address": "127.0.0.1", "tcpPort": 30303, "udpPort": 30303}]`
   * @param params An object containing an address, tcpPort, and udpPort for target server to connect to
   */
  async addPeer(params: [object]) {
    const service = this._client.service as any as FullSilaService
    const server = service.pool.config.server as RlpxServer
    const dpt = server.dpt

    let peerInfo
    try {
      peerInfo = await dpt!.addPeer(params[0])
      const rlpxPeer = new RlpxPeer({
        config: new Config(),
        id: bytesToHex(peerInfo.id!),
        host: peerInfo.address!,
        port: peerInfo.tcpPort as number,
      })
      service.pool.add(rlpxPeer)
    } catch (err: any) {
      throw {
        code: INTERNAL_ERROR,
        message: `failed to add peer: ${JSON.stringify(params)}`,
        stack: err?.stack,
      }
    }

    return peerInfo !== undefined
  }
}
