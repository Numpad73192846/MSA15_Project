import { useState } from 'react'
import './App.css'
import LifeCycleClass from './components/LifeCycleClass'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LifeCycleFunction />
    </>
  )
}

export default App
