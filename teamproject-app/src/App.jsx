import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import LoginContextProvider from './utils/context/LoginContextProvider'

function App() {

  return (
    <BrowserRouter>
      <LoginContextProvider>
        <Routes>
          <Route path='/' element={ <Home /> } />
        </Routes>
      </LoginContextProvider>
    </BrowserRouter>
  )
}

export default App
