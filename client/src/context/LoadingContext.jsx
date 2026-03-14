import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { setupInterceptors } from "../services/api";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [delayedIsLoading, setDelayedIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Splitting things up...");

  const startLoading = useCallback((text) => {
    if (typeof text === 'string') {
      setLoadingText(text);
    }
    setLoadingCount((prev) => prev + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingCount((prev) => {
      const nextCount = Math.max(0, prev - 1);
      if (nextCount === 0) {
        setLoadingText("Splitting things up...");
      }
      return nextCount;
    });
  }, []);

  useEffect(() => {
    const { reqId, resId } = setupInterceptors(startLoading, stopLoading);

    return () => {
      import("../services/api").then(({ default: API }) => {
        API.interceptors.request.eject(reqId);
        API.interceptors.response.eject(resId);
      });
    };
  }, [startLoading, stopLoading]);

  useEffect(() => {
    let timer;
    if (loadingCount > 0) {
      timer = setTimeout(() => {
        setDelayedIsLoading(true);
      }, 40);
    } else {
      setDelayedIsLoading(false);
      if (timer) clearTimeout(timer);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loadingCount]);

  const isLoading = delayedIsLoading;

  return (
    <LoadingContext.Provider value={{ isLoading, loadingText, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
