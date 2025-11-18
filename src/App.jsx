import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route path="/home" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/edit-profile" element={<EditProfile />} />
        <Route path="/account/change-password" element={<ChangePassword />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App
