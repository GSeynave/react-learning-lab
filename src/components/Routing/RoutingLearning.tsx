import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HeroesPage from "./HeroesPage";
import HeroDetailsPage from "./HeroDetailsPage";
import HeroDetailsWithServerPage from "./HeroDetailsWithServerPage";

function RoutingLearning() {
  return (
    <>
      <h1>Routing </h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/heroes" replace />} />
          <Route path="/heroes" element={<HeroesPage />} />

          <Route path="/heroes/:heroId" element={<HeroDetailsPage />} />
          <Route
            path="/heroes/:heroId/server"
            element={<HeroDetailsWithServerPage />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default RoutingLearning;
