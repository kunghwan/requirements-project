import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/Auth";
import Project from "./pages/Project/Project";
import RequirementPage from "./pages/Requirement/RequirementPage";
import RDetailPage from "./pages/RDetail/RDetailPage";
import Layout from "./components/Layout";
import { AUTH } from "./context/hooks";
import NotFound from "./components/ui/NotFound";

const App = () => {
  const { user } = AUTH.use();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <NotFound
              message="접근할수 없는 페이지"
              to={user ? "/project" : "/"}
            />
          }
        />
        <Route path="/" Component={Layout}>
          <Route index element={<Home />} />
          {!user && <Route path="signin" element={<AuthPage />} />}
          <Route path="project">
            <Route index Component={Project} />
            <Route path=":projectId">
              <Route index element={<RequirementPage />} />
              <Route path=":rid" element={<RDetailPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
