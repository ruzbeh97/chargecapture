import { useState, useEffect, useRef } from 'react'
import MultiSelectDropdown from './MultiSelectDropdown'
import './ProcedureCodesComponent.css'

interface ProcedureCodesComponentProps {
  onRemove?: () => void
}

interface CPTCodeRow {
  id: string
  cptCode: string
  modifiers: string[]
  units: string
}

// Combobox component for modifiers
function ModifierCombobox({ 
  value, 
  onChange, 
  options 
}: { 
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const comboboxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase()
    setInputValue(newValue)
    onChange(newValue)
  }

  const handleSelect = (option: string) => {
    setInputValue(option)
    onChange(option)
    setIsOpen(false)
  }

  const filteredOptions = options.filter(opt => 
    opt.toUpperCase().startsWith(inputValue.toUpperCase())
  )

  return (
    <div className="modifier-combobox" ref={comboboxRef}>
      <div className="modifier-combobox-input-wrapper">
        <input
          type="text"
          className="modifier-combobox-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Mod"
          maxLength={10}
        />
        <div 
          className="modifier-combobox-arrow"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className="modifier-combobox-menu">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                className="modifier-combobox-option"
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="modifier-combobox-option modifier-combobox-option-empty">
              No matches
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ProcedureCodesComponent({ onRemove }: ProcedureCodesComponentProps) {
  const [selectedCPTCodes, setSelectedCPTCodes] = useState<string[]>([])
  const [cptCodeRows, setCPTCodeRows] = useState<CPTCodeRow[]>([])

  // Common orthopedic CPT codes
  const cptCodeOptions = [
    '27447 - Total knee arthroplasty',
    '27130 - Total hip arthroplasty',
    '29881 - Arthroscopy, shoulder, surgical; with repair of SLAP lesion',
    '29827 - Arthroscopy, shoulder, surgical; with rotator cuff repair',
    '29826 - Arthroscopy, shoulder, surgical; decompression of subacromial space',
    '29825 - Arthroscopy, shoulder, surgical; with lysis and resection of labrum',
    '29824 - Arthroscopy, shoulder, surgical; distal claviculectomy',
    '29823 - Arthroscopy, shoulder, surgical; debridement, extensive',
    '29822 - Arthroscopy, shoulder, surgical; debridement, limited',
    '29821 - Arthroscopy, shoulder, surgical; synovectomy, partial',
    '29820 - Arthroscopy, shoulder, surgical; synovectomy, complete',
    '29819 - Arthroscopy, shoulder, surgical; with removal of loose body or foreign body',
    '29880 - Arthroscopy, knee, surgical; with meniscectomy',
    '29877 - Arthroscopy, knee, surgical; debridement/shaving of articular cartilage',
    '29879 - Arthroscopy, knee, surgical; abrasion arthroplasty',
    '29882 - Arthroscopy, knee, surgical; with meniscectomy (medial OR lateral)',
    '29883 - Arthroscopy, knee, surgical; with meniscectomy (medial AND lateral)',
    '29884 - Arthroscopy, knee, surgical; with lysis of adhesions',
    '29885 - Arthroscopy, knee, surgical; synovectomy, limited',
    '29886 - Arthroscopy, knee, surgical; synovectomy, major',
    '29888 - Arthroscopy, knee, surgical; drilling for osteochondritis dissecans',
    '29887 - Arthroscopy, knee, surgical; drilling for intact osteochondritis dissecans lesion',
    '23472 - Arthroplasty, glenohumeral joint; total shoulder',
    '23470 - Arthroplasty, glenohumeral joint; hemiarthroplasty',
    '23466 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23465 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23464 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23463 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23462 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23461 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23460 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23459 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23458 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23457 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23456 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23455 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23454 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23453 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23452 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23451 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23450 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23440 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23430 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23420 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '23410 - Arthroplasty, glenohumeral joint; humeral and glenoid components',
    '29807 - Arthroscopy, shoulder, surgical; repair of SLAP lesion',
    '29806 - Arthroscopy, shoulder, surgical; capsulorrhaphy',
    '29805 - Arthroscopy, shoulder, surgical; synovectomy, complete',
    '29804 - Arthroscopy, shoulder, surgical; synovectomy, partial',
    '29803 - Arthroscopy, shoulder, surgical; debridement, extensive',
    '29802 - Arthroscopy, shoulder, surgical; debridement, limited',
    '29801 - Arthroscopy, shoulder, surgical; diagnostic',
    '29800 - Arthroscopy, shoulder, surgical; diagnostic',
    '29875 - Arthroscopy, knee, surgical; synovectomy, major',
    '29874 - Arthroscopy, knee, surgical; synovectomy, limited',
    '29873 - Arthroscopy, knee, surgical; with lateral release'
  ]

  // Update rows when selected CPT codes change
  useEffect(() => {
    const newRows: CPTCodeRow[] = selectedCPTCodes.map((code) => ({
      id: code,
      cptCode: code,
      modifiers: [''],
      units: ''
    }))
    setCPTCodeRows(newRows)
  }, [selectedCPTCodes])

  const handleDeleteRow = (id: string) => {
    const rowToDelete = cptCodeRows.find(row => row.id === id)
    if (rowToDelete && rowToDelete.cptCode) {
      // Remove from selected codes
      setSelectedCPTCodes(selectedCPTCodes.filter(code => code !== rowToDelete.cptCode))
    } else {
      // Remove row directly if it doesn't have a CPT code
      setCPTCodeRows(cptCodeRows.filter(row => row.id !== id))
    }
  }

  const handleModifierChange = (rowId: string, modifierIndex: number, value: string) => {
    setCPTCodeRows(cptCodeRows.map(row => {
      if (row.id === rowId) {
        const newModifiers = [...row.modifiers]
        newModifiers[modifierIndex] = value
        return { ...row, modifiers: newModifiers }
      }
      return row
    }))
  }

  const handleUnitsChange = (rowId: string, value: string) => {
    setCPTCodeRows(cptCodeRows.map(row => {
      if (row.id === rowId) {
        return { ...row, units: value }
      }
      return row
    }))
  }

  const handleAddModifier = (rowId: string) => {
    setCPTCodeRows(cptCodeRows.map(row => {
      if (row.id === rowId) {
        return { ...row, modifiers: [...row.modifiers, ''] }
      }
      return row
    }))
  }

  const handleRemoveModifier = (rowId: string) => {
    setCPTCodeRows(cptCodeRows.map(row => {
      if (row.id === rowId) {
        const newModifiers = row.modifiers.slice(0, -1)
        // Ensure at least one modifier remains
        if (newModifiers.length === 0) {
          return { ...row, modifiers: [''] }
        }
        return { ...row, modifiers: newModifiers }
      }
      return row
    }))
  }

  const modifierOptions = ['LT', 'RT', 'BI']

  return (
    <div className="procedure-codes-component">
      <div className="procedure-codes-header">
        <h3 className="procedure-codes-title">Procedure Codes & Modifiers</h3>
        {onRemove && (
          <button 
            className="procedure-codes-delete-button" 
            aria-label="Delete"
            onClick={onRemove}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 5H17.5M15.8333 5V16.6667C15.8333 17.1269 15.4602 17.5 15 17.5H5C4.53976 17.5 4.16667 17.1269 4.16667 16.6667V5M6.66667 5V3.33333C6.66667 2.8731 7.03976 2.5 7.5 2.5H12.5C12.9602 2.5 13.3333 2.8731 13.3333 3.33333V5" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      
      <div className="procedure-codes-content">
        <MultiSelectDropdown
          placeholder="Add procedure codes"
          selectedValues={selectedCPTCodes}
          onChange={setSelectedCPTCodes}
          options={cptCodeOptions}
        />

        {cptCodeRows.length > 0 && (
          <div className="cpt-code-rows">
            {cptCodeRows.map((row) => (
            <div key={row.id} className="cpt-code-row">
              <div className="cpt-code-field">
                <div className="cpt-code-tooltip-wrapper">
                  <input 
                    type="text" 
                    placeholder="CPT Code" 
                    value={row.cptCode}
                    className="cpt-code-input"
                    readOnly
                  />
                  {row.cptCode && (
                    <div className="cpt-code-tooltip">
                      {row.cptCode}
                    </div>
                  )}
                </div>
              </div>
              <div className="cpt-code-controls">
                <div className="modifiers-group">
                  {row.modifiers.map((mod, index) => (
                    <ModifierCombobox
                      key={index}
                      value={mod}
                      onChange={(value) => handleModifierChange(row.id, index, value)}
                      options={modifierOptions}
                    />
                  ))}
                </div>
                <div className="cpt-code-actions">
                  <button 
                    className="icon-button-small" 
                    aria-label="Remove modifier"
                    onClick={() => handleRemoveModifier(row.id)}
                    disabled={row.modifiers.length <= 1}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="9" stroke="#666" strokeWidth="1.5"/>
                      <path d="M6 10H14" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button 
                    className="icon-button-small" 
                    aria-label="Add modifier"
                    onClick={() => handleAddModifier(row.id)}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="9" stroke="#666" strokeWidth="1.5"/>
                      <path d="M10 6V14M6 10H14" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <input
                    type="text"
                    className="units-input"
                    placeholder="Units"
                    value={row.units}
                    onChange={(e) => handleUnitsChange(row.id, e.target.value)}
                  />
                  <button className="icon-button-small" aria-label="Delete" onClick={() => handleDeleteRow(row.id)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 5H17.5M15.8333 5V16.6667C15.8333 17.1269 15.4602 17.5 15 17.5H5C4.53976 17.5 4.16667 17.1269 4.16667 16.6667V5M6.66667 5V3.33333C6.66667 2.8731 7.03976 2.5 7.5 2.5H12.5C12.9602 2.5 13.3333 2.8731 13.3333 3.33333V5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProcedureCodesComponent

