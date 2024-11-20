import type { AppProps } from "next/app";
import { Providers } from "@/components/providers";
import { CosmosProvider } from "@/components/cosmos-provider";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CosmosProvider>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </CosmosProvider>
  );
}