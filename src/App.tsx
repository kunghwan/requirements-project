import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/Auth";
import Project from "./pages/Project/Project";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="signin" Component={AuthPage} />
        <Route path="project" Component={Project} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
