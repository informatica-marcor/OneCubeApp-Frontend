import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

import LoginRedirect from "./pages/LoginRedirect";
import Layout from './components/layout/Layout';
import Leases from './pages/Leases';
import GuestAccess from "./pages/GuestAccess";
import Help from "./pages/Help";
import Warehouses from './pages/Warehouses';
import Clients from './pages/Clients';
import Tickets from './pages/Tickets';
import Monitor from './pages/Monitor';
import PrivateRoute from './pages/PrivateRoute';
import Regulation from './pages/Regulation';
import TriggerEmails from './pages/TriggerEmails';

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginRedirect />} />

          <Route element={<PrivateRoute allowedRoles={["client"]} />}>
            <Route element={<Layout />}>
              <Route path="/leases" element={<Leases />} />
              <Route path="/visits" element={<GuestAccess />} />
              <Route path="/help" element={<Help />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route element={<Layout />}>
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/monitor" element={<Monitor />} />
              <Route path="/regulation" element={<Regulation />} />
              <Route path="/emails" element={<TriggerEmails />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}