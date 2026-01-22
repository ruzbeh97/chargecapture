import { useState } from 'react'
import TextField from './TextField'
import Dropdown from './Dropdown'
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
}

function AdvancedTextSnippetView({ onOrderSetAdded }: AdvancedTextSnippetViewProps) {
  const [phrase, setPhrase] = useState('')
  const [section, setSection] = useState('')
  const [userAccess, setUserAccess] = useState('')
  const [useForEHRScribe, setUseForEHRScribe] = useState(false)
  const [configurationItems, setConfigurationItems] = useState<ConfigurationItem[]>([])

  const sections = [
    'Assessment',
    'Plan',
    'Physical Exam',
    'History',
    'General Notes'
  ]

  const userAccessOptions = [
    'All Users',
    'Admin Only',
    'Physicians',
    'Nurses'
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
    
    // Notify drawer if Order/Order Set component was removed
    if (itemToRemove?.type === 'order-set' && onOrderSetAdded) {
      const hasOrderSet = updatedItems.some(item => item.type === 'order-set')
      onOrderSetAdded(hasOrderSet)
    }
  }

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
          <label className="advanced-form-label">Available Sections of Visit Note</label>
          <Dropdown
            placeholder="Select a Section"
            value={section}
            onChange={setSection}
            options={sections}
          />
        </div>
        <div className="advanced-form-field">
          <label className="advanced-form-label">User Access</label>
          <Dropdown
            placeholder="Select a user"
            value={userAccess}
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
                    <TextSnippetComponent onRemove={() => handleRemoveItem(item.id)} />
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
