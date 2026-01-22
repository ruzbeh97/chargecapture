import { useState, useEffect } from 'react'
import TextField from './TextField'
import Dropdown from './Dropdown'
import MultiSelectDropdown from './MultiSelectDropdown'
import Switch from './Switch'
import Chip from './Chip'
import TextSnippetComponent from './TextSnippetComponent'
import OrderSetComponent from './OrderSetComponent'
import ProcedureCodesComponent from './ProcedureCodesComponent'
import DiagnosisCodesComponent from './DiagnosisCodesComponent'
import './AdvancedTextSnippetView.css'

type ConfigurationItem = {
  id: string
  type: 'text-snippet' | 'procedure-codes' | 'order-set' | 'diagnosis-codes'
}

interface AdvancedTextSnippetViewProps {
  onOrderSetAdded?: (hasOrderSet: boolean) => void
  onDataChange?: (data: {
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
  }) => void
  initialData?: {
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
}

function AdvancedTextSnippetView({ onOrderSetAdded, onDataChange, initialData }: AdvancedTextSnippetViewProps) {
  const [phrase, setPhrase] = useState(initialData?.phrase || '')
  const [section, setSection] = useState(initialData?.section || '')
  const [userAccess, setUserAccess] = useState<string[]>(initialData?.userAccess || [])
  const [useForEHRScribe, setUseForEHRScribe] = useState(initialData?.useForEHRScribe || false)
  const [configurationItems, setConfigurationItems] = useState<ConfigurationItem[]>(() => {
    // Initialize with text snippet component if there's initial content
    if (initialData?.textSnippetContent) {
      return [{ id: Date.now().toString(), type: 'text-snippet' }]
    }
    return []
  })
  const [textSnippetContent, setTextSnippetContent] = useState(initialData?.textSnippetContent || '')
  const [textSnippetData, setTextSnippetData] = useState<{ html: string; alternateWordDropdowns: any[] } | null>(null)

  const sections = [
    'Assessment',
    'Plan',
    'Physical Exam',
    'History',
    'General Notes'
  ]

  const userAccessOptions = [
    'All',
    'Dr. Smith',
    'Dr. Johnson',
    'Dr. Williams',
    'Dr. Brown',
    'Dr. Jones',
    'Dr. Garcia',
    'Dr. Miller',
    'Dr. Davis',
    'Dr. Rodriguez',
    'Dr. Martinez',
    'Dr. Hernandez',
    'Dr. Lopez',
    'Dr. Wilson',
    'Dr. Anderson',
    'Dr. Thomas',
    'Dr. Taylor',
    'Dr. Moore',
    'Dr. Jackson',
    'Dr. Martin'
  ]

  const handleChipClick = (chipType: string) => {
    let newItem: ConfigurationItem | null = null
    
    if (chipType === 'Text Snippet') {
      newItem = {
        id: Date.now().toString(),
        type: 'text-snippet'
      }
    } else if (chipType === 'Order / Order Set') {
      newItem = {
        id: Date.now().toString(),
        type: 'order-set'
      }
    } else if (chipType === 'Procedure Codes') {
      newItem = {
        id: Date.now().toString(),
        type: 'procedure-codes'
      }
    } else if (chipType === 'Diagnosis Codes') {
      newItem = {
        id: Date.now().toString(),
        type: 'diagnosis-codes'
      }
    }
    
    if (newItem) {
      const updatedItems = [...configurationItems, newItem]
      setConfigurationItems(updatedItems)
      
      // Notify drawer if Order/Order Set component was added
      if (newItem.type === 'order-set' && onOrderSetAdded) {
        onOrderSetAdded(true)
      }
    }
  }

  const handleRemoveItem = (id: string) => {
    const itemToRemove = configurationItems.find(item => item.id === id)
    const updatedItems = configurationItems.filter(item => item.id !== id)
    setConfigurationItems(updatedItems)
    
    // Clear text snippet content if text snippet component was removed
    if (itemToRemove?.type === 'text-snippet') {
      setTextSnippetContent('')
    }
    
    // Notify drawer if Order/Order Set component was removed
    if (itemToRemove?.type === 'order-set' && onOrderSetAdded) {
      const hasOrderSet = updatedItems.some(item => item.type === 'order-set')
      onOrderSetAdded(hasOrderSet)
    }
  }

  useEffect(() => {
    if (onDataChange) {
      const data = {
        phrase,
        section,
        userAccess,
        useForEHRScribe,
        textSnippetContent: textSnippetData?.html || textSnippetContent,
        textSnippetData: textSnippetData || undefined
      }
      onDataChange(data)
    }
  }, [phrase, section, userAccess, useForEHRScribe, textSnippetContent, textSnippetData, onDataChange])

  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <div className="advanced-text-snippet-view">
      <div className="advanced-form-row">
        <div className="advanced-form-field">
          <label className="advanced-form-label">Phrase / Trigger Word</label>
          <TextField
            placeholder="Add Phrase / Trigger"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
          />
        </div>
        <div className="advanced-form-field">
          <label className="advanced-form-label">Sections of Visit Note</label>
          <Dropdown
            placeholder="Select a Section"
            value={section}
            onChange={setSection}
            options={sections}
          />
        </div>
        <div className="advanced-form-field">
          <label className="advanced-form-label">User Access</label>
          <MultiSelectDropdown
            placeholder="Select users"
            selectedValues={userAccess}
            onChange={setUserAccess}
            options={userAccessOptions}
          />
        </div>
      </div>

      <div className="advanced-configuration-section">
        <label className="advanced-form-label">Configuration</label>
        <div className="configuration-container">
          {configurationItems.length === 0 ? (
            <div className="configuration-placeholder">
              <p className="configuration-placeholder-text">
                Add one of the objects below to build your text snippet
              </p>
            </div>
          ) : (
            <div className="configuration-items">
              {configurationItems.map((item) => (
                <div key={item.id} className="configuration-item-wrapper">
                  {item.type === 'text-snippet' && (
                    <TextSnippetComponent 
                      key={`text-snippet-${initialData?.textSnippetContent || 'new'}-${item.id}`}
                      onRemove={() => handleRemoveItem(item.id)}
                      onContentChange={(content) => {
                        setTextSnippetContent(content)
                      }}
                      onDataChange={(data) => {
                        setTextSnippetData(data)
                        // Also update text content for display
                        if (data.html) {
                          const tempDiv = document.createElement('div')
                          tempDiv.innerHTML = data.html
                          setTextSnippetContent(tempDiv.innerText || '')
                        }
                      }}
                      initialContent={initialData?.textSnippetContent}
                      initialData={initialData?.textSnippetData || (initialData?.textSnippetContent ? {
                        html: initialData.textSnippetContent,
                        alternateWordDropdowns: []
                      } : undefined)}
                    />
                  )}
                  {item.type === 'order-set' && (
                    <OrderSetComponent 
                      onRemove={() => handleRemoveItem(item.id)}
                    />
                  )}
                  {item.type === 'procedure-codes' && (
                    <ProcedureCodesComponent 
                      onRemove={() => handleRemoveItem(item.id)}
                    />
                  )}
                  {item.type === 'diagnosis-codes' && (
                    <DiagnosisCodesComponent 
                      onRemove={() => handleRemoveItem(item.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="configuration-chips">
            <Chip
              label="Text Snippet"
              icon={<PlusIcon />}
              onClick={() => handleChipClick('Text Snippet')}
            />
            <Chip
              label="Procedure Codes"
              icon={<PlusIcon />}
              onClick={() => handleChipClick('Procedure Codes')}
            />
            <Chip
              label="Order / Order Set"
              icon={<PlusIcon />}
              onClick={() => handleChipClick('Order / Order Set')}
            />
            <Chip
              label="Diagnosis Codes"
              icon={<PlusIcon />}
              onClick={() => handleChipClick('Diagnosis Codes')}
            />
          </div>
        </div>
      </div>

      <div className="advanced-switch-field">
        <Switch
          checked={useForEHRScribe}
          onChange={setUseForEHRScribe}
        />
        <label className="advanced-switch-label">Use for EHR Scribe</label>
      </div>
    </div>
  )
}

export default AdvancedTextSnippetView
