import { useState } from 'react'
import Switch from './Switch'
import './TextSnippetsTable.css'

interface TableRow {
  id: string
  phrase: string
  procedureDoc: string
  users: string
  section: string
  useForEHRScribe: boolean
}

interface TextSnippetsTableProps {
  onAddClick: () => void
}

function TextSnippetsTable({ onAddClick }: TextSnippetsTableProps) {
  const [activeTab, setActiveTab] = useState<'advanced' | 'standard'>('advanced')
  const [rows, setRows] = useState<TableRow[]>([
    {
      id: '1',
      phrase: 'Phrase/ Trigger',
      procedureDoc: 'Procedure Documentation Example Text',
      users: 'Dr. Swarovski',
      section: 'Assessment',
      useForEHRScribe: true
    },
    {
      id: '2',
      phrase: 'Phrase/ Trigger',
      procedureDoc: 'Procedure Documentation Example Text',
      users: 'Dr. Swarovski',
      section: 'Assessment',
      useForEHRScribe: true
    },
    {
      id: '3',
      phrase: 'Phrase/ Trigger',
      procedureDoc: 'Procedure Documentation Example Text',
      users: 'Dr. Swarovski',
      section: 'Assessment',
      useForEHRScribe: true
    },
    {
      id: '4',
      phrase: 'Phrase/ Trigger',
      procedureDoc: 'Procedure Documentation Example Text',
      users: 'Dr. Swarovski',
      section: 'Assessment',
      useForEHRScribe: true
    },
    {
      id: '5',
      phrase: 'Phrase/ Trigger',
      procedureDoc: 'Procedure Documentation Example Text',
      users: 'Dr. Swarovski',
      section: 'Assessment',
      useForEHRScribe: true
    },
    {
      id: '6',
      phrase: 'Phrase/ Trigger',
      procedureDoc: 'Procedure Documentation Example Text',
      users: 'Dr. Swarovski',
      section: 'Assessment',
      useForEHRScribe: true
    }
  ])

  const handleToggleSwitch = (id: string) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, useForEHRScribe: !row.useForEHRScribe } : row
    ))
  }

  return (
    <div className="text-snippets-page">
      <div className="page-header">
        <h1 className="page-title">Text Snippets</h1>
        <div className="page-header-actions">
          <div className="search-container">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L11.1 11.1" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
          <button className="add-text-snippet-button" onClick={onAddClick}>
            + Add Text Snippet
          </button>
        </div>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced Text Snippets
        </button>
        <button 
          className={`tab-button ${activeTab === 'standard' ? 'active' : ''}`}
          onClick={() => setActiveTab('standard')}
        >
          Standard Text Snippets
        </button>
      </div>

      <div className="table-container">
        <table className="text-snippets-table">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">Phrase/Trigger</th>
              <th className="table-header-cell">Procedure Documentation Snippet</th>
              <th className="table-header-cell">Users</th>
              <th className="table-header-cell">Section of Visit Note</th>
              <th className="table-header-cell">Use for EHR Scribe</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="table-row">
                <td className="table-cell">{row.phrase}</td>
                <td className="table-cell">
                  <span className="procedure-doc-link">{row.procedureDoc}</span>
                </td>
                <td className="table-cell">{row.users}</td>
                <td className="table-cell">{row.section}</td>
                <td className="table-cell table-cell-actions">
                  <Switch
                    checked={row.useForEHRScribe}
                    onChange={() => handleToggleSwitch(row.id)}
                  />
                  <div className="action-icons">
                    <button className="icon-button" aria-label="Edit">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.3333 2.00004C11.5084 1.82493 11.7163 1.68605 11.9447 1.59131C12.1731 1.49658 12.4173 1.44775 12.6667 1.44775C12.916 1.44775 13.1602 1.49658 13.3886 1.59131C13.617 1.68605 13.8249 1.82493 14 2.00004C14.1751 2.17515 14.314 2.38306 14.4087 2.61146C14.5034 2.83986 14.5523 3.08407 14.5523 3.33337C14.5523 3.58268 14.5034 3.82689 14.4087 4.05529C14.314 4.28369 14.1751 4.4916 14 4.66671L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00004Z" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="icon-button" aria-label="Copy">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.33334 9.33333H4.00001C3.26363 9.33333 2.66667 8.73638 2.66667 8V4C2.66667 3.26362 3.26363 2.66667 4.00001 2.66667H8.00001C8.73638 2.66667 9.33334 3.26362 9.33334 4V5.33333M12 6.66667H8.00001C7.26363 6.66667 6.66667 7.26362 6.66667 8V12C6.66667 12.7364 7.26363 13.3333 8.00001 13.3333H12C12.7364 13.3333 13.3333 12.7364 13.3333 12V8C13.3333 7.26362 12.7364 6.66667 12 6.66667Z" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="icon-button" aria-label="Delete">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2762C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2762C3.47381 14.0261 3.33334 13.687 3.33334 13.3333V4M5.33334 4V2.66667C5.33334 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33334 6.66667 1.33334H9.33334C9.68696 1.33334 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TextSnippetsTable

