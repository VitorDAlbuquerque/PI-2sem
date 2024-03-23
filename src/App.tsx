import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import { Settings } from "./pages/Settings";
import { Movies } from "./pages/Movies";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Movies" element={<Movies />} />
          <Route path="/Settings" element={<Settings />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
