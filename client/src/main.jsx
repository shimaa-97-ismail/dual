import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { store, persistor } from "./store/store";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/Auth/AuthProvider.jsx";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 دقائق قبل اعتبار البيانات قديمة
      cacheTime: 10 * 60 * 1000, // 10 دقائق في الكاش
      retry: 2, // إعادة المحاولة مرتين عند الفشل
      refetchOnWindowFocus: false, // عدم إعادة الجلب عند التركيز على النافذة
    },
  },
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Toaster position="top-center" />
            <QueryClientProvider client={queryClient}>
              <App />
              {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
