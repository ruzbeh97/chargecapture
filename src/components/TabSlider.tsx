import './TabSlider.css'

interface TabOption {
  value: string
  label: string
}

interface TabSliderProps {
  options: TabOption[]
  activeValue: string
  onChange: (value: string) => void
}

function TabSlider({ options, activeValue, onChange }: TabSliderProps) {
  return (
    <div className="tab-slider">
      {options.map((option) => (
        <button
          key={option.value}
          className={`tab-slider-item ${activeValue === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          <span className="tab-slider-label">{option.label}</span>
        </button>
      ))}
    </div>
  )
}

export default TabSlider

