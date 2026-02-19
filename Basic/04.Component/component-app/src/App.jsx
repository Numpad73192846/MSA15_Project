import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ClassComponent from './components/ClassComponent'
import FunctionComponent from './components/FunctionComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ClassComponent />
      <hr />
      <FunctionComponent />
    </>
  )
}

export default App
