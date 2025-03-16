import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppIotaProviders } from "./AppIotaProviders";

import { PageAbout } from "./pages/PageAbout";
import { PageNFT } from "./pages/PageNFT";
import { PageHome } from "./pages/PageHome";
import { PageNotFound } from "./pages/PageNotFound";
import { PageRPCs } from "./pages/PageRPCs";
import { PageSpam } from "./pages/PageSpam";
import { PageStats } from "./pages/PageStats";
import { PageWallet } from "./pages/PageWallet";

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppIotaProviders />}>
          <Route index element={<PageHome />} />
          <Route path="/about" element={<PageAbout />} />
          <Route path="/spam" element={<PageSpam />} />
          <Route path="/nft" element={<PageNFT />} />
          <Route path="/wallet" element={<PageWallet />} />
          <Route path="/rpcs" element={<PageRPCs />} />
          <Route path="/stats" element={<PageStats />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
