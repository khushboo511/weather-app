import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/layout"
import { ThemeProvider } from "./components/providers/theme-provider"
import Dashboard from "./pages/weather-dashboard"
import City from "./pages/city-page"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function App() {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5* 60 * 1000,
        gcTime: 10* 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark">
          <Layout>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/city/:cityName' element={<City />} />
            </Routes>
          </Layout>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
