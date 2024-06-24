"use client"

import {Button, FormControl, FormHelperText, FormLabel, Heading, Input, Select, useToast} from "@chakra-ui/react";
import {useAccounts} from "@/app/hooks";
import {api} from "@/app/libs/api";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {sendTransaction} from "@/app/libs/sendTransaction";
import {useState} from "react";

export default function TransferForm() {
    let {accounts, selectedAccount, selectAccount} = useAccounts();
    let [isLoading, setLoading] = useState(false)
    const queryClient = useQueryClient()
    const toast = useToast({position: "top-right"})
    let data = useQuery({
        enabled: selectedAccount?.address !== undefined,
        queryKey: [`balances/${selectedAccount?.address}`],
        queryFn: () => api.queryBalance(selectedAccount?.address)
    })

    const formik = useFormik({
        initialValues: {
            to: "",
            from: "",
            amount: 0,
        },
        //check if amount is less than balance
        validationSchema: Yup.object({
            amount: Yup.number().min(0, 'Amount must be greater than 0').max(data.data || 0, 'Amount must be less than balance'),
        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                if (!selectedAccount) throw Error("Please select an account")
                let tx = await api.transferExtrinsic(selectedAccount.address, values.to, values.amount)
                await tx.signAsync(selectedAccount.address, {signer: selectedAccount.injector.signer})
                await sendTransaction(tx)
                await queryClient.invalidateQueries({queryKey: [`balances/${selectedAccount?.address}`]})
                toast({
                    title: 'Transaction Success',
                    description: 'Transaction has been sent',
                    status: 'success',
                })
            } catch (e) {
                toast({
                    title: 'Transaction Failed',
                    description: JSON.stringify(e.message),
                    status: 'error',
                })
            }
            setLoading(false)
        },
    })

    return (
        <div className="w-1/2 border-2 shadow-green-200 p-6">
            <Heading className="mb-6 text-green-900">Simple Transfer</Heading>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel className="mt-3">Select account from extension</FormLabel>
                    <Select placeholder='Select Account' id="from" name="from" value={formik.values.from}
                            onChange={(e) => {
                                console.log("here")
                                formik.handleChange(e)
                                selectAccount?.(accounts.find(account => account.address === e.target.value))
                            }}>
                        {accounts.map((option) => {
                            return (
                                <option key={option.address} value={option.address}>{option?.name}</option>
                            )
                        })}
                    </Select>
                    <FormLabel className="mt-3">To Account</FormLabel>
                    <Input id='to' name='to' onChange={formik.handleChange} value={formik.values.to} type='text'/>
                    <FormLabel className="mt-3">Amount</FormLabel>
                    <Input id='amount' name='amount' onChange={formik.handleChange} value={formik.values.amount}
                           type='number'/>
                    <FormHelperText>{`Current Balance: ${data.data || 0} ROC`}</FormHelperText>
                    <Button
                        className='w-full'
                        mt={4}
                        colorScheme='green'
                        type='submit'
                        isDisabled={isLoading}
                    >
                        {isLoading ? "Loading.." : "Submit"}
                    </Button>
                </FormControl>
            </form>
        </div>
    )
}