import { useState } from 'react'
import Drawer from './components/Drawer'
import TextSnippetsTable from './components/TextSnippetsTable'
import './App.css'

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="app">
      <TextSnippetsTable onAddClick={() => setIsDrawerOpen(true)} />
      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </div>
  )
}

export default App

