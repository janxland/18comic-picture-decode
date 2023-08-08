"use client";
import Player from "@/components/Player/Index";
import Sidebar from "@/components/Sidebar";
import { RootStoreProvider } from "@/context/root-context";
import { logMiruInfo } from "@/utils/miru-log";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { ReactElement, useEffect } from "react";

const queryClient = new QueryClient();

export default function RootProvider({ children }: { children: ReactElement }) {
    useEffect(() => {
        logMiruInfo();
    }, []);
    return (
        <RootStoreProvider>
            <QueryClientProvider client={queryClient}>
                <SnackbarProvider
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    autoHideDuration={3000}
                >
                    <Sidebar />
                    {children}
                    <Player />
                </SnackbarProvider>
            </QueryClientProvider>
        </RootStoreProvider>
    );
}
