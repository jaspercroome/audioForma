import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'
import { requestAuthToken } from "../src/queries/spotify";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  const token = requestAuthToken();
  console.log(token)
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
