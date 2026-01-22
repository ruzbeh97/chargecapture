import { useState, useRef, useEffect } from 'react'
import './Dropdown.css'

interface DropdownProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  options: string[]
}

function Dropdown({ placeholder, value, onChange, options }: DropdownProps) {
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

  const handleSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div 
        className="dropdown-input"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`dropdown-value ${!value ? 'dropdown-placeholder' : ''}`}>
          {value || placeholder}
        </span>
        <div className="dropdown-arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option}
              className={`dropdown-option ${value === option ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown

