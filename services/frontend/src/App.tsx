import { useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { authApi, usersApi } from "@/api/endpoints";
import { useTheme } from "@/hooks/useTheme";
import Loading from "@/components/ui/Loading";

import LoginPage from "@/pages/LoginPage";
import SettingPage from "@/pages/SettingPage";
import Layout from "@/pages/Layout";
import HomePage from "@/pages/HomePage";
import ArchivedPage from "@/pages/ArchivedPage";
import SearchPage from "@/pages/SearchPage";
import TagsPage from "@/pages/TagsPage";
import NotePage from "@/pages/NotePage";
import NewNotePage from "@/pages/NewNotePage";
import SettingsPage from "@/pages/SettingsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
    },
  },
});

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  useTheme();
  return <>{children}</>;
}

function AuthGate() {
  const status = useAuthStore((s) => s.status);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const initAuth = async () => {
      try {
        const { data: tokenData } = await authApi.refresh();
        setToken(tokenData.accessToken);
        const { data: userData } = await usersApi.me();
        setUser(userData);
      } catch {
        logout();
      }
    };

    initAuth();
  }, [setToken, setUser, logout]);

  if (status === "loading") return <Loading />;
  if (status === "unauthed") return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeWrapper>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AuthGate />}>
              <Route element={<Layout />}>
                <Route index element={<Navigate to="/home" replace />} />

                <Route path="/home" element={<HomePage />}>
                  <Route path="note/:noteId" element={<NotePage />} />
                </Route>

                <Route path="/archived" element={<ArchivedPage />}>
                  <Route path="note/:noteId" element={<NotePage />} />
                </Route>

                <Route path="/search" element={<SearchPage />}>
                  <Route path="note/:noteId" element={<NotePage />} />
                </Route>

                <Route path="/tag" element={<TagsPage />} />
                <Route path="/tag/:tagName" element={<TagsPage />}>
                  <Route path="note/:noteId" element={<NotePage />} />
                </Route>

                <Route path="/newnote" element={<NewNotePage />} />

                <Route path="/settings" element={<SettingsPage />}>
                  <Route path=":setting" element={<SettingPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </ThemeWrapper>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
