"use client"

import {Account} from "@/app/providers/types";
import {createContext, PropsWithChildren, useEffect, useState} from "react";
import {web3Accounts, web3Enable, web3EnablePromise, web3FromAddress} from "@polkadot/extension-dapp";
import {cryptoWaitReady} from "@polkadot/util-crypto";

export type ContextState = {
    accounts: Account[]
    selectedAccount?: Account
    selectAccount?: (account: Account | undefined) => void
}

export const AccountsContext = createContext<ContextState>({accounts: []});

export const AccountsProvider = ({ children, ss58 }:  PropsWithChildren<{ss58: number}> ) => {
    const [accounts, setAccounts] = useState<Account[]>([])
    const [selectedAccount, setSelectedAccount] = useState<Account>()

    const selectAccount = (account: Account | undefined) => {
        if (!account) {
            alert("Account not found")
            return
        }
        setSelectedAccount(account)
    }

    useEffect(() => {
        const init = async () => {
            await cryptoWaitReady()
            await web3Enable('simple-transfer');
            await web3EnablePromise
            const allAccounts = await web3Accounts();
            const accountPromises = allAccounts.map(async (account) => {
                const injector = await web3FromAddress(account.address);
                return {
                    address: account.address,
                    name: account.meta.name,
                    injector,
                }
            })
            const accounts = await Promise.all(accountPromises)
            setAccounts(accounts)
        }
        init().then(console.log)
    }, [])
    return (
        <AccountsContext.Provider value={{accounts, selectAccount, selectedAccount}}>
            {children}
        </AccountsContext.Provider>
    )
}