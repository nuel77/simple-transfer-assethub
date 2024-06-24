"use client"
import TransferForm from "@/app/components/TransferForm";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import dynamic from "next/dynamic";

const AccountsProvider = dynamic(() => import('./providers/accountsProvider').then(mod => mod.AccountsProvider), {
    ssr: false,
})
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
