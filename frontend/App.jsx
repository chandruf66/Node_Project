import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Login'
import Dashboard from './Dashboard'
import Create from './Create'
import Create_user from './Create_user'
import UserEdit from './UserEdit'
import User_details from './user_details'
import Lu_details from './Lu_details'
import Lu_edit from './Lu_edit'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Login />}></Route>
    <Route path='/login' element={<Login />}></Route>
    <Route path='/Dashboard' element={<Dashboard />}></Route>
    <Route path='/Create' element={<Create />}></Route>
    <Route path='/UserEdit/:id' element={<UserEdit />}></Route>
    <Route path='/User_details' element={<User_details />}></Route>
    <Route path='/Create_user' element={<Create_user />}></Route>
    <Route path='/Lu_details' element={<Lu_details />}></Route>
    <Route path='/Lu_edit/:id' element={<Lu_edit />}></Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App
