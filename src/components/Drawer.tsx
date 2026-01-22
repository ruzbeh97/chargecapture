import { useState } from 'react'
import TabSlider from './TabSlider'
import BasicTextSnippetView from './BasicTextSnippetView'
import AdvancedTextSnippetView from './AdvancedTextSnippetView'
import './Drawer.css'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
}

type ViewType = 'basic' | 'advanced'

function Drawer({ isOpen, onClose }: DrawerProps) {
  const [activeView, setActiveView] = useState<ViewType>('basic')
  const [displayView, setDisplayView] = useState<ViewType>('basic')
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isFadingIn, setIsFadingIn] = useState(false)
  const [hasOrderSet, setHasOrderSet] = useState(false)

  const handleViewChange = (value: ViewType) => {
    if (value === activeView || isFadingOut || isFadingIn) return
    
    // Step 1: Fade out current view (200ms)
    setIsFadingOut(true)
    
    // Step 2: After fade out completes, change view
    setTimeout(() => {
      setActiveView(value)
      setDisplayView(value)
      setIsFadingOut(false)
      
      // Reset drawer expansion when switching views
      setHasOrderSet(false)
      
      // Step 3: Set fade-in flag (CSS animation-delay will handle timing)
      setIsFadingIn(true)
      
      // Step 4: After fade in completes (200ms animation + 100ms delay = 300ms total), reset state
      setTimeout(() => {
        setIsFadingIn(false)
      }, 300)
    }, 200)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className={`drawer ${hasOrderSet ? 'drawer-expanded' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-header-content">
            <h2 className="drawer-title">
              {activeView === 'advanced' ? 'Add Advanced Text Snippet' : 'Add Text Snippet'}
            </h2>
          </div>
          <button className="drawer-close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="drawer-content">
          <div className="drawer-content-inner">
            <div className="tab-section">
              <div className="tab-label-wrapper">
                <label className="tab-label">Type of Snippet</label>
              </div>
              <TabSlider
                options={[
                  { value: 'basic', label: 'Standard Text Snippet' },
                  { value: 'advanced', label: 'Advanced Text Snippet' }
                ]}
                activeValue={activeView}
                onChange={(value) => handleViewChange(value as ViewType)}
              />
            </div>
            
            <div className={`view-container ${isFadingOut ? 'view-fade-out' : isFadingIn ? 'view-fade-in' : ''}`}>
              {displayView === 'basic' && <BasicTextSnippetView />}
              {displayView === 'advanced' && <AdvancedTextSnippetView onOrderSetAdded={setHasOrderSet} />}
            </div>
          </div>
        </div>
        
        <div className="drawer-footer">
          <div className="drawer-footer-actions">
            <button className="button-primary">Save</button>
            <button className="button-secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Drawer

