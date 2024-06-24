import {ApiPromise, WsProvider} from "@polkadot/api";
import {SubmittableExtrinsic} from "@polkadot/api/promise/types";

export class Api {
    api: ApiPromise;

    constructor(url: string) {
        let ws = new WsProvider(url)
        this.api = new ApiPromise({provider: ws})
    }

    public async decimals(): Promise<number> {
        await this.api.isReady;
        return this.api.registry.chainDecimals[0]
    }

    public async queryBalance(address: string | undefined): Promise<number> {
        if (!address) return 0;
        await this.api.isReady;
        let balance = await this.api.query.system.account(address)
        let json = balance.toJSON() as any;
        console.log(json, address)
        return Number(BigInt(json.data.free || 0) / BigInt(10 ** await this.decimals()))
    }

    public async transferExtrinsic(sender: string, recipient: string, amount: number): Promise<SubmittableExtrinsic> {
        await this.api.isReady;
        return this.api.tx.balances.transferKeepAlive(recipient, amount * (10 ** await this.decimals()))
    }
}

export const api = new Api("wss://rococo-asset-hub-rpc.polkadot.io")