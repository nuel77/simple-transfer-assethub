"use client"

import {useContext} from "react";
import {AccountsContext} from "@/app/providers/accountsProvider";

export const useAccounts = () => {
    const state = useContext(AccountsContext);
    return {...state};
}