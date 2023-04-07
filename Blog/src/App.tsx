import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Blog from './pages/blog'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
function App() {
  return (
    <>
      <ToastContainer />
      <Blog />
    </>
  )
}

export default App
