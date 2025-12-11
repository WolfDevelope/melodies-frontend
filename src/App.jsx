import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import LoginPassword from './pages/LoginPassword'
import CreatePassword from './pages/CreatePassword'
import PersonalInfo from './pages/PersonalInfo'
import TermsConfirmation from './pages/TermsConfirmation'
import EmailVerification from './pages/EmailVerification'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Account from './pages/Account'
import EditProfile from './pages/EditProfile'
import ChangePassword from './pages/ChangePassword'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Search from './pages/Search'
import CreatePlaylist from './pages/CreatePlaylist'
import PlaylistDetail from './pages/PlaylistDetail'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes - No layout */}
        <Route path="/login">
          <Route index element={<Login />} />
          <Route path="password" element={<LoginPassword />} />
        </Route>
        <Route path="/signup">
          <Route index element={<SignUp />} />
          <Route path="create-password" element={<CreatePassword />} />
          <Route path="personal-info" element={<PersonalInfo />} />
          <Route path="terms" element={<TermsConfirmation />} />
          <Route path="verify-email" element={<EmailVerification />} />
        </Route>
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        {/* Main app routes - With layout (Sidebar, Header, Player) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/playlist/create" element={<CreatePlaylist />} />
          <Route path="/playlist/:id" element={<PlaylistDetail />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/edit-profile" element={<EditProfile />} />
          <Route path="/account/change-password" element={<ChangePassword />} />
        </Route>

        {/* Admin route - No layout */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App
