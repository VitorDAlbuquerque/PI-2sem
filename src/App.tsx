import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { Profile } from "./pages/Profile"
import { Login } from "./pages/Login"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Profile" element={<Profile/>}/>
        </Routes>
      </AuthProvider>

    </BrowserRouter>
  )
}

export default App
