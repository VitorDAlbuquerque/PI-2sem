import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import { Settings } from "./pages/Settings";
import { Movies } from "./pages/Movies";
import { PopularWatchLists } from "./pages/PopularWatchLists";
import { WatchList } from "./pages/WatchList";
import { Page404Error } from "./pages/Page404Error";
import { RecoverPassowrd } from "./pages/RecoverPassword";
import { MovieDetails } from "./pages/MovieDetails";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Profile/:id" element={<Profile />} />
          <Route path="/Movies" element={<Movies />} />
          <Route path="/WatchList/:id" element={<WatchList />} />
          <Route path="/PopularWatchLists" element={<PopularWatchLists />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/RecoverPassword" element={<RecoverPassowrd />} />
          <Route path="/Movie/:movieId" element={<MovieDetails/>} />
          <Route path="*" element={<Page404Error />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
