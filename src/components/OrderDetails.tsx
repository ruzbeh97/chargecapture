import { useState, useEffect, useRef } from 'react'
import MultiSelectDropdown from './MultiSelectDropdown'
import AlternateWordDropdown from './AlternateWordDropdown'
import './OrderDetails.css'

interface OrderDetailsProps {
  orderName: string
  onDelete?: () => void
}

interface AlternateWord {
  id: string
  word: string
  isDefault: boolean
}

interface AlternateWordDropdownData {
  id: string
  words: AlternateWord[]
  position: { top: number; left: number } | null
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

function OrderDetails({ orderName, onDelete }: OrderDetailsProps) {
  const [selectedCPTCodes, setSelectedCPTCodes] = useState<string[]>([])
  const [cptCodeRows, setCPTCodeRows] = useState<CPTCodeRow[]>([])
  const [alternateWordDropdowns, setAlternateWordDropdowns] = useState<AlternateWordDropdownData[]>([])
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

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

  // Rich text editor commands
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleFormatBlock = (tag: string) => {
    executeCommand('formatBlock', tag)
  }

  // Update placeholder text when default word changes
  useEffect(() => {
    alternateWordDropdowns.forEach(dropdown => {
      const defaultWord = dropdown.words.find(w => w.isDefault)
      const placeholder = editorRef.current?.querySelector(`[data-dropdown-id="${dropdown.id}"]`) as HTMLElement
      
      if (placeholder) {
        if (defaultWord) {
          placeholder.textContent = defaultWord.word
        } else {
          placeholder.textContent = '[Magic Word]'
        }
      }
    })
  }, [alternateWordDropdowns])

  return (
    <div className="order-details">
      <div className="order-details-title-row">
        <h3 className="order-details-title">{orderName}</h3>
        {onDelete && (
          <button 
            className="order-details-delete-button" 
            aria-label={`Delete ${orderName}`}
            onClick={onDelete}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 5H17.5M15.8333 5V16.6667C15.8333 17.1269 15.4602 17.5 15 17.5H5C4.53976 17.5 4.16667 17.1269 4.16667 16.6667V5M6.66667 5V3.33333C6.66667 2.8731 7.03976 2.5 7.5 2.5H12.5C12.9602 2.5 13.3333 2.8731 13.3333 3.33333V5" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      
      <div className="order-details-sections">
        <div className="order-details-section">
          <div className="procedure-documentation-header">
            <div className="procedure-documentation-title-row">
              <h4 className="procedure-documentation-title">Procedure Documentation</h4>
              <button className="procedure-documentation-info-button" aria-label="Info">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 13.3333V10M10 6.66667H10.0083" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="procedure-documentation-editor-container">
            <div className="procedure-documentation-toolbar">
              <div className="toolbar-left">
                <div className="toolbar-group">
                  {/* Text Style/Size Dropdown - Large T overlapping small t */}
                  <button 
                    className="toolbar-button"
                    onClick={() => handleFormatBlock('p')}
                    title="Text Style"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Large T */}
                      <path d="M4 4H10M7 4V12" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      {/* Small t */}
                      <path d="M11 6H13M12 6V10" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="toolbar-divider"></div>
                  {/* Bold - Capital B */}
                  <button 
                    className="toolbar-button"
                    onClick={() => executeCommand('bold')}
                    title="Bold"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 4V16M5 4H9C10.1046 4 11 4.89543 11 6C11 7.10457 10.1046 8 9 8H5M5 8H9.5C10.6046 8 11.5 8.89543 11.5 10C11.5 11.1046 10.6046 12 9.5 12H5M5 12V16" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {/* Italic - Capital I */}
                  <button 
                    className="toolbar-button"
                    onClick={() => executeCommand('italic')}
                    title="Italic"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 4H11M9 4V16" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {/* Underline - Capital U with line beneath */}
                  <button 
                    className="toolbar-button"
                    onClick={() => executeCommand('underline')}
                    title="Underline"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 4V9C5 11.2091 6.79086 13 9 13C11.2091 13 13 11.2091 13 9V4" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 16H15" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  {/* Strikethrough - Capital S with line through */}
                  <button 
                    className="toolbar-button"
                    onClick={() => executeCommand('strikeThrough')}
                    title="Strikethrough"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 6C5 5 5.89543 4 7 4H9C10.1046 4 11 5 11 6C11 7 10.1046 8 9 8H5M5 12C5 13 5.89543 14 7 14H9C10.1046 14 11 13 11 12C11 11 10.1046 10 9 10H5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 10H15" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <div className="toolbar-divider"></div>
                  {/* Alignment Dropdown - Four lines of varying lengths, left-aligned */}
                  <button 
                    className="toolbar-button"
                    onClick={() => executeCommand('justifyLeft')}
                    title="Text Alignment"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 5H15" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M3 8H12" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M3 11H14" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M3 14H10" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {/* Numbered List - 1, 2, 3 stacked with lines */}
                  <button 
                    className="toolbar-button"
                    onClick={() => executeCommand('insertOrderedList')}
                    title="Numbered List"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 7.5H4.5M6 7.5H15" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M3 11.5H4.5M6 11.5H15" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M3 15.5H4.5M6 15.5H15" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      {/* Number 1 */}
                      <path d="M3.5 5.5L3.5 7.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M3.5 5.5L4.5 6.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      {/* Number 2 */}
                      <path d="M3.5 9.5L4.5 9.5L4.5 10.5L3.5 11.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      {/* Number 3 */}
                      <path d="M3.5 13.5L4.5 13.5M3.5 15.5L4.5 15.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M3.5 14.5L4.5 14.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                  {/* Bulleted List - Three circles stacked with lines */}
                  <button 
                    className="toolbar-button"
                    onClick={() => executeCommand('insertUnorderedList')}
                    title="Bulleted List"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="4" cy="7.5" r="1.5" fill="#666"/>
                      <path d="M8 7.5H15" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="4" cy="11.5" r="1.5" fill="#666"/>
                      <path d="M8 11.5H15" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="4" cy="15.5" r="1.5" fill="#666"/>
                      <path d="M8 15.5H15" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <div className="toolbar-divider"></div>
                  {/* Text Color - Capital A with thick line beneath */}
                  <button 
                    className="toolbar-button"
                    onClick={() => {
                      const color = prompt('Enter color (e.g., #000000 or red):', '#000000')
                      if (color) executeCommand('foreColor', color)
                    }}
                    title="Text Color"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 16L8 4H12L15 16M6.5 12H13.5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 18H17" stroke="#666" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {/* Highlight Color - Paint bucket with drop on line */}
                  <button 
                    className="toolbar-button"
                    onClick={() => {
                      const color = prompt('Enter highlight color (e.g., #FFFF00 or yellow):', '#FFFF00')
                      if (color) executeCommand('backColor', color)
                    }}
                    title="Highlight Color"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Paint bucket */}
                      <path d="M8 4L12 8L8 12L4 8L8 4Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      {/* Drop */}
                      <path d="M8 4V2" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="8" cy="2" r="1" fill="#666"/>
                      {/* Line beneath */}
                      <path d="M3 16H13" stroke="#666" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="toolbar-right">
                <button 
                  className="add-word-alternative-button"
                  onClick={() => {
                    const dropdownId = Date.now().toString()
                    const newDropdown: AlternateWordDropdownData = {
                      id: dropdownId,
                      words: [],
                      position: null
                    }
                    setAlternateWordDropdowns([...alternateWordDropdowns, newDropdown])
                    
                    // Insert dropdown element in editor - only if editor is focused or exists
                    if (editorRef.current) {
                      // Focus the editor first
                      editorRef.current.focus()
                      
                      // Wait a bit for focus to take effect, then insert
                      setTimeout(() => {
                        const selection = window.getSelection()
                        let range: Range | null = null
                        
                        // Check if selection is within the editor
                        if (selection && selection.rangeCount > 0) {
                          const currentRange = selection.getRangeAt(0)
                          // Check if the selection is within the editor
                          if (editorRef.current?.contains(currentRange.commonAncestorContainer)) {
                            range = currentRange
                          }
                        }
                        
                        // If no valid range in editor, create one at the end
                        if (!range && editorRef.current) {
                          range = document.createRange()
                          range.selectNodeContents(editorRef.current)
                          range.collapse(false) // Collapse to end
                          
                          if (selection) {
                            selection.removeAllRanges()
                            selection.addRange(range)
                          }
                        }
                        
                        if (range) {
                          const dropdownSpan = document.createElement('span')
                          dropdownSpan.className = 'alternate-word-dropdown-placeholder'
                          dropdownSpan.setAttribute('data-dropdown-id', dropdownId)
                          dropdownSpan.textContent = '[Magic Word]'
                          dropdownSpan.contentEditable = 'false'
                          dropdownSpan.style.display = 'inline-block'
                          dropdownSpan.style.padding = '2px 8px'
                          dropdownSpan.style.margin = '0 2px'
                          dropdownSpan.style.backgroundColor = '#f0f0f0'
                          dropdownSpan.style.border = '1px dashed #ccc'
                          dropdownSpan.style.borderRadius = '4px'
                          dropdownSpan.style.cursor = 'pointer'
                          dropdownSpan.onclick = (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const rect = dropdownSpan.getBoundingClientRect()
                            setAlternateWordDropdowns(prev => prev.map(d => 
                              d.id === dropdownId 
                                ? { 
                                    ...d, 
                                    position: { 
                                      top: rect.bottom + window.scrollY, 
                                      left: rect.left + window.scrollX 
                                    } 
                                  }
                                : d
                            ))
                            setActiveDropdownId(dropdownId)
                          }
                          
                          range.insertNode(dropdownSpan)
                          range.setStartAfter(dropdownSpan)
                          range.collapse(true)
                          
                          if (selection) {
                            selection.removeAllRanges()
                            selection.addRange(range)
                          }
                        }
                      }, 10)
                    }
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 2.91667V11.0833M2.91667 7H11.0833" stroke="#1132ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Magic Word</span>
                </button>
              </div>
            </div>
            <div className="procedure-documentation-editor" style={{ position: 'relative' }}>
              <div
                ref={editorRef}
                className="procedure-documentation-textarea"
                contentEditable
                data-placeholder="Add procedure documentation here"
              />
              {activeDropdownId && (() => {
                const dropdown = alternateWordDropdowns.find(d => d.id === activeDropdownId)
                return dropdown && dropdown.position ? (
                  <AlternateWordDropdown
                    position={dropdown.position}
                    onClose={() => setActiveDropdownId(null)}
                    onAddWord={(word, isDefault) => {
                      setAlternateWordDropdowns(prev => prev.map(d => {
                        if (d.id === activeDropdownId) {
                          const newWord = { id: Date.now().toString(), word, isDefault: false }
                          let updatedWords: AlternateWord[]
                          
                          // If isDefault is true, add at the top and set as default
                          // Otherwise, add at the end
                          if (isDefault) {
                            updatedWords = [newWord, ...d.words]
                            updatedWords[0].isDefault = true
                            // Remove default from all other words
                            updatedWords.forEach((w, index) => {
                              if (index > 0) w.isDefault = false
                            })
                          } else {
                            updatedWords = [...d.words, newWord]
                          }
                          
                          return { ...d, words: updatedWords }
                        }
                        return d
                      }))
                    }}
                    existingWords={dropdown.words}
                    onUpdateWord={(id, word, isDefault) => {
                      setAlternateWordDropdowns(prev => prev.map(d =>
                        d.id === activeDropdownId
                          ? { ...d, words: d.words.map(w => w.id === id ? { ...w, word, isDefault } : w) }
                          : d
                      ))
                    }}
                    onDeleteWord={(id) => {
                      setAlternateWordDropdowns(prev => prev.map(d =>
                        d.id === activeDropdownId
                          ? { ...d, words: d.words.filter(w => w.id !== id) }
                          : d
                      ))
                    }}
                    onReorderWords={(reorderedWords) => {
                      setAlternateWordDropdowns(prev => prev.map(d =>
                        d.id === activeDropdownId
                          ? { ...d, words: reorderedWords }
                          : d
                      ))
                    }}
                  />
                ) : null
              })()}
            </div>
          </div>
        </div>

        <div className="order-details-section">
          <h4 className="section-title">Procedure Codes & Modifiers</h4>
          <div className="procedure-codes-container">
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
      </div>
    </div>
  )
}

export default OrderDetails

