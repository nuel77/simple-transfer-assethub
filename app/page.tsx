"use client"

import TransferForm from "@/app/components/TransferForm";
import {AccountsProvider} from "@/app/providers/accountsProvider";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <QueryClientProvider client={queryClient}>
                <AccountsProvider ss58={88}>
                    <TransferForm/>
                </AccountsProvider>
            </QueryClientProvider>
        </main>
    );
}
