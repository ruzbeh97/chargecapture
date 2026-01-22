import './Chip.css'

interface ChipProps {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
}

function Chip({ label, icon, onClick }: ChipProps) {
  return (
    <div className="chip" onClick={onClick}>
      {icon && <div className="chip-icon">{icon}</div>}
      <span className="chip-label">{label}</span>
    </div>
  )
}

export default Chip

