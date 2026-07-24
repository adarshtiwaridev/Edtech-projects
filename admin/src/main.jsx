import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store, persistor } from "./store/store";
import { injectStore } from "./api/axiosInstance";
import { Provider } from "react-redux";

injectStore(store);
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
            <Toaster />
            <SonnerToaster richColors position="top-right" />
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);