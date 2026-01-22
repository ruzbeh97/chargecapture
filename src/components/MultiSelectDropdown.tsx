import { useState, useRef, useEffect } from 'react'
import './MultiSelectDropdown.css'

interface MultiSelectDropdownProps {
  placeholder?: string
  selectedValues: string[]
  onChange: (values: string[]) => void
  options: string[]
}

function MultiSelectDropdown({ placeholder, selectedValues, onChange, options }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleToggle = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option))
    } else {
      onChange([...selectedValues, option])
    }
  }

  const handleRemoveBadge = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selectedValues.filter(v => v !== value))
  }

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <div 
        className="multi-select-input"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues.length === 0 ? (
          <span className="multi-select-placeholder">{placeholder}</span>
        ) : (
          <div className="multi-select-badges">
            {selectedValues.map((value) => (
              <span key={value} className="multi-select-badge">
                {value}
                <button
                  className="multi-select-badge-remove"
                  onClick={(e) => handleRemoveBadge(value, e)}
                  aria-label={`Remove ${value}`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3L3 9M3 3L9 9" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="multi-select-arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className="multi-select-menu">
          {options.map((option) => (
            <div
              key={option}
              className={`multi-select-option ${selectedValues.includes(option) ? 'selected' : ''}`}
              onClick={() => handleToggle(option)}
            >
              {option}
              {selectedValues.includes(option) && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="#1132ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MultiSelectDropdown

