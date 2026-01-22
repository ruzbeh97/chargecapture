import { useState, useCallback, useEffect } from 'react'
import AdvancedTextSnippetView from './AdvancedTextSnippetView'
import { TableRow } from './TextSnippetsTable'
import './Drawer.css'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (row: TableRow) => void
  editingRow?: TableRow
}

// Helper to reset state
const getInitialAdvancedViewData = (): AdvancedViewData => ({
  phrase: '',
  section: '',
  userAccess: [],
  useForEHRScribe: false,
  textSnippetContent: '',
  textSnippetData: undefined
})

interface AdvancedViewData {
  phrase: string
  section: string
  userAccess: string[]
  useForEHRScribe: boolean
  textSnippetContent: string
  textSnippetData?: {
    html: string
    alternateWordDropdowns: Array<{
      id: string
      words: Array<{
        id: string
        word: string
        isDefault: boolean
      }>
      position?: { top: number; left: number } | null
    }>
  }
}

function Drawer({ isOpen, onClose, onSave, editingRow }: DrawerProps) {
  const [hasOrderSet, setHasOrderSet] = useState(false)
  const [advancedViewData, setAdvancedViewData] = useState<AdvancedViewData>(getInitialAdvancedViewData())

  // Use useCallback to stabilize the callback
  const handleAdvancedDataChange = useCallback((data: AdvancedViewData) => {
    setAdvancedViewData(data)
  }, [])

  // Reset or populate state when drawer opens
  useEffect(() => {
    if (isOpen) {
      if (editingRow) {
        // Populate with editing row data
        const userAccessArray = editingRow.users === 'All' ? [] : editingRow.users.split(', ').filter(u => u.trim() !== '')
        setAdvancedViewData({
          phrase: editingRow.phrase || '',
          section: editingRow.section || '',
          userAccess: userAccessArray,
          useForEHRScribe: editingRow.useForEHRScribe || false,
          textSnippetContent: editingRow.procedureDoc || '',
          textSnippetData: editingRow.textSnippetData
        })
      } else {
        // Reset to initial state
        setAdvancedViewData(getInitialAdvancedViewData())
      }
      setHasOrderSet(false)
    }
  }, [isOpen, editingRow])

  const handleSave = () => {
    // Format user access array to string
    const usersString = advancedViewData.userAccess.length > 0
      ? advancedViewData.userAccess.join(', ')
      : 'All'
    
    // Extract text from HTML for display in table
    let displayText = advancedViewData.textSnippetContent || 'Text Snippet'
    if (advancedViewData.textSnippetData?.html) {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = advancedViewData.textSnippetData.html
      displayText = tempDiv.innerText || displayText
    }
    
    const newRow: TableRow = {
      id: editingRow ? editingRow.id : Date.now().toString(),
      phrase: advancedViewData.phrase || 'Phrase/ Trigger',
      procedureDoc: displayText, // Display text in table, but save HTML in textSnippetData
      users: usersString,
      section: advancedViewData.section || '',
      useForEHRScribe: advancedViewData.useForEHRScribe,
      textSnippetData: advancedViewData.textSnippetData
    }
    onSave(newRow)
  }

  if (!isOpen) {
    return null
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className={`drawer ${hasOrderSet ? 'drawer-expanded' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-header-content">
            <h2 className="drawer-title">{editingRow ? 'Edit Text Snippet' : 'Add Text Snippet'}</h2>
          </div>
          <button className="drawer-close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="drawer-content">
          <div className="drawer-content-inner">
            <AdvancedTextSnippetView 
              key={editingRow?.id || 'new'}
              onOrderSetAdded={setHasOrderSet}
              onDataChange={handleAdvancedDataChange}
              initialData={editingRow ? {
                phrase: editingRow.phrase || '',
                section: editingRow.section || '',
                userAccess: editingRow.users === 'All' ? [] : editingRow.users.split(', ').filter(u => u.trim() !== ''),
                useForEHRScribe: editingRow.useForEHRScribe || false,
                textSnippetContent: editingRow.textSnippetData?.html || editingRow.procedureDoc || '',
                textSnippetData: editingRow.textSnippetData || (editingRow.procedureDoc ? {
                  html: editingRow.procedureDoc,
                  alternateWordDropdowns: []
                } : undefined)
              } : undefined}
            />
          </div>
        </div>
        
        <div className="drawer-footer">
          <div className="drawer-footer-actions">
            <button type="button" className="button-primary" onClick={handleSave}>Save</button>
            <button className="button-secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Drawer

