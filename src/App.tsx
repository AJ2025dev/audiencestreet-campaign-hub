import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Advertisers from "./pages/Advertisers";
import AdvertiserCampaigns from "./pages/AdvertiserCampaigns";
import Campaigns from "./pages/Campaigns";
import CreateCampaign from "./pages/CreateCampaign";
import Creatives from "./pages/Creatives";
import Audiences from "./pages/Audiences";
import RetailMedia from "./pages/RetailMedia";
import Reports from "./pages/Reports";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import DomainLists from "./pages/DomainLists";
import AppLists from "./pages/AppLists";
import PublisherLists from "./pages/PublisherLists";
import FrequencyCapping from "./pages/FrequencyCapping";
import PMPDeals from "./pages/PMPDeals";
import MetaAds from "./pages/MetaAds";
import GoogleAds from "./pages/GoogleAds";
import MediaPlanning from "./pages/MediaPlanning";
import TestDashboard from "./pages/TestDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={
              <ProtectedRoute requireRole="admin">
                <Layout>
                  <Admin />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/agency" element={
              <ProtectedRoute requireRole="agency">
                <Layout>
                  <Advertisers />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/advertiser" element={
              <ProtectedRoute requireRole="advertiser">
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/advertisers" element={
              <ProtectedRoute>
                <Layout>
                  <Advertisers />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/advertisers/:advertiserId/campaigns" element={
              <ProtectedRoute>
                <Layout>
                  <AdvertiserCampaigns />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <Layout>
                  <Campaigns />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/campaigns/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateCampaign />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/creatives" element={
              <ProtectedRoute>
                <Layout>
                  <Creatives />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/audiences" element={
              <ProtectedRoute>
                <Layout>
                  <Audiences />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/retail-media" element={
              <ProtectedRoute>
                <Layout>
                  <RetailMedia />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/domain-lists" element={
              <ProtectedRoute>
                <Layout>
                  <DomainLists />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/app-lists" element={
              <ProtectedRoute>
                <Layout>
                  <AppLists />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/publisher-lists" element={
              <ProtectedRoute>
                <Layout>
                  <PublisherLists />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/pmp-deals" element={
              <ProtectedRoute>
                <Layout>
                  <PMPDeals />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/meta-ads" element={
              <ProtectedRoute>
                <Layout>
                  <MetaAds />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/google-ads" element={
              <ProtectedRoute>
                <Layout>
                  <GoogleAds />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/media-planning" element={
              <ProtectedRoute>
                <Layout>
                  <MediaPlanning />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/frequency-capping" element={
              <ProtectedRoute>
                <Layout>
                  <FrequencyCapping />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/test-dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <TestDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
