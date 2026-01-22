import { useState } from 'react'
import Drawer from './components/Drawer'
import TextSnippetsTable, { TableRow } from './components/TextSnippetsTable'
import './App.css'

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [rows, setRows] = useState<TableRow[]>([
    {
      id: '1',
      phrase: 'Phrase/ Trigger',
      procedureDoc: 'Procedure Documentation Example Text',
      users: 'Dr. Swarovski',
      section: 'Assessment',
      useForEHRScribe: true
    }
  ])
  const [editingRowId, setEditingRowId] = useState<string | null>(null)

  const handleSave = (newRow: TableRow) => {
    if (editingRowId) {
      // Update existing row
      setRows(prevRows => prevRows.map(row => 
        row.id === editingRowId ? { ...newRow, id: editingRowId } : row
      ))
      setEditingRowId(null)
    } else {
      // Add new row
      setRows(prevRows => [...prevRows, newRow])
    }
    setIsDrawerOpen(false)
  }

  const handleEdit = (rowId: string) => {
    setEditingRowId(rowId)
    setIsDrawerOpen(true)
  }

  const handleDuplicate = (rowId: string) => {
    const rowToDuplicate = rows.find(row => row.id === rowId)
    if (rowToDuplicate) {
      const duplicatedRow: TableRow = {
        ...rowToDuplicate,
        id: Date.now().toString()
      }
      setRows(prevRows => [...prevRows, duplicatedRow])
    }
  }

  const handleDelete = (rowId: string) => {
    setRows(prevRows => prevRows.filter(row => row.id !== rowId))
  }

  return (
    <div className="app">
      <TextSnippetsTable 
        onAddClick={() => {
          setEditingRowId(null)
          setIsDrawerOpen(true)
        }} 
        rows={rows}
        onRowsChange={setRows}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />
      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => {
          setEditingRowId(null)
          setIsDrawerOpen(false)
        }}
        onSave={handleSave}
        editingRow={editingRowId ? rows.find(row => row.id === editingRowId) : undefined}
      />
    </div>
  )
}

export default App

