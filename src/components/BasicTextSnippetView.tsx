import { useState, useEffect } from 'react'
import TextField from './TextField'
import TextArea from './TextArea'
import Dropdown from './Dropdown'
import Switch from './Switch'
import './BasicTextSnippetView.css'

interface BasicTextSnippetViewProps {
  onDataChange?: (data: {
    phrase: string
    textSnippet: string
    groupName: string
    appointmentType: string
    macroType: string
    useForEHRScribe: boolean
  }) => void
}

function BasicTextSnippetView({ onDataChange }: BasicTextSnippetViewProps) {
  const [phrase, setPhrase] = useState('')
  const [textSnippet, setTextSnippet] = useState('')
  const [groupName, setGroupName] = useState('')
  const [appointmentType, setAppointmentType] = useState('')
  const [macroType, setMacroType] = useState('')
  const [useForEHRScribe, setUseForEHRScribe] = useState(false)

  useEffect(() => {
    if (onDataChange) {
      const data = {
        phrase,
        textSnippet,
        groupName,
        appointmentType,
        macroType,
        useForEHRScribe
      }
      console.log('BasicTextSnippetView onDataChange called with:', data)
      onDataChange(data)
    }
  }, [phrase, textSnippet, groupName, appointmentType, macroType, useForEHRScribe, onDataChange])

  // Sample data for dropdowns
  const groupNames = [
    'General Notes',
    'Assessment',
    'Plan',
    'Physical Exam',
    'History'
  ]

  const appointmentTypes = [
    'Initial Evaluation Wrist',
    'Follow Up Knee',
    'Post Op Follow Up',
    'Consultation',
    'Procedure'
  ]

  const macroTypes = [
    'Clinical Note',
    'Procedure Note',
    'Assessment',
    'Plan',
    'History'
  ]

  return (
    <div className="basic-text-snippet-view">
      <div className="form-fields">
        <div className="form-field">
          <TextField
            placeholder="Phrase/Trigger"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
          />
        </div>

        <div className="form-field">
          <TextArea
            placeholder="Text Snippet"
            value={textSnippet}
            onChange={(e) => setTextSnippet(e.target.value)}
            maxLength={160}
          />
        </div>

        <div className="form-field">
          <Dropdown
            placeholder="Group Name (Optional)"
            value={groupName}
            onChange={(value) => setGroupName(value)}
            options={groupNames}
          />
        </div>

        <div className="form-field">
          <Dropdown
            placeholder="Select Appointment Types (Optional)"
            value={appointmentType}
            onChange={(value) => setAppointmentType(value)}
            options={appointmentTypes}
          />
        </div>

        <div className="form-field">
          <Dropdown
            placeholder="Select Macro Type (Optional)"
            value={macroType}
            onChange={(value) => setMacroType(value)}
            options={macroTypes}
          />
        </div>

        <div className="form-field switch-field">
          <Switch
            checked={useForEHRScribe}
            onChange={setUseForEHRScribe}
          />
          <label className="switch-label">Use for EHR Scribe</label>
        </div>
      </div>
    </div>
  )
}

export default BasicTextSnippetView
