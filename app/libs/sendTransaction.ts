import {SubmittableExtrinsic} from "@polkadot/api/promise/types";

export async function sendTransaction(tx: SubmittableExtrinsic) {
    // wait for block success and then return, otherwise throw error
    return new Promise((resolve, reject) => {
        tx.send(({events = [], status}) => {
            if (status.isInBlock) {
                console.log('Successful transfer of', status.asInBlock.toHex())
                resolve(status.asInBlock.toHex())
            } else if (status.isFinalized) {
                console.log('Finalized block hash', status.asFinalized.toHex())
                resolve(status.asFinalized.toHex())
            }
            //check if error has occured
            else if (events.find(({event: {method, section}}) =>
                section === 'system' && method === 'ExtrinsicFailed'
            )) {
                reject(new Error('Transaction Failed'))
            }
        })
    })
}