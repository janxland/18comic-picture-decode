"use client"
import Sidebar from "@/components/Sidebar";
import { RootStoreProvider } from "@/context/root-context";
import { logMiruInfo } from "@/utils/miru-log";
import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function ({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        logMiruInfo()
    }, [])
    return (
        <RootStoreProvider >
            <QueryClientProvider client={queryClient}>
                <SnackbarProvider anchorOrigin={{ horizontal: "right", vertical: "top" }} autoHideDuration={3000} >
                    <Sidebar />
                    {children}
                </SnackbarProvider>
            </QueryClientProvider>
        </RootStoreProvider>
    )
}