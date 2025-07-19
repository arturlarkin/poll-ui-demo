import { useState } from 'react'
import './App.css'
import Header from './pages/header/Header'
import { Route, Routes } from 'react-router-dom'
import Signup from './pages/auth/signup/Signup'
import Dashboard from './pages/user/dashboard/Dashboard'
import CreatePoll from './pages/user/create-poll/CreatePoll'
import ViewMyPolls from './pages/user/view-my-polls/ViewMyPolls'
import ViewPollDetails from './pages/user/view-poll-details/ViewPollDetails'
import Login from './pages/auth/login/Login'
import Profile from './pages/user/profile/Profile'
import Reset from './pages/auth/reset/Reset'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Routes>
        <Route exact path='/' element={<Dashboard />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset' element={<Reset />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/poll/create' element={<CreatePoll />} />
        <Route path='/my-polls' element={<ViewMyPolls />} />
        <Route path='/poll/:id/:view' element={<ViewPollDetails />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
