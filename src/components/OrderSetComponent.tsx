import { useState } from 'react'
import MultiSelectDropdown from './MultiSelectDropdown'
import OrderDetails from './OrderDetails'
import './OrderSetComponent.css'

interface OrderSetComponentProps {
  onRemove?: () => void
}

function OrderSetComponent({ onRemove }: OrderSetComponentProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const orderOptions = [
    'Inject VISCO',
    'Physical Therapy Referral',
    'MRI Shoulder',
    'X-Ray Knee',
    'DME Brace Order'
  ]

  const handleOrderChange = (selected: string[]) => {
    setSelectedOrders(selected)
  }

  const handleRemoveOrder = (orderToRemove: string) => {
    setSelectedOrders(selectedOrders.filter(order => order !== orderToRemove))
  }

  return (
    <div className="order-set-component">
      <div className="order-set-header">
        <h3 className="order-set-title">Order / Order Sets</h3>
        {onRemove && (
          <button 
            className="order-set-delete-button" 
            aria-label="Delete"
            onClick={onRemove}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 5H17.5M15.8333 5V16.6667C15.8333 17.1269 15.4602 17.5 15 17.5H5C4.53976 17.5 4.16667 17.1269 4.16667 16.6667V5M6.66667 5V3.33333C6.66667 2.8731 7.03976 2.5 7.5 2.5H12.5C12.9602 2.5 13.3333 2.8731 13.3333 3.33333V5" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      <div className="order-set-content">
        <MultiSelectDropdown
          placeholder="Add and order / orderset"
          selectedValues={selectedOrders}
          onChange={handleOrderChange}
          options={orderOptions}
        />
        {selectedOrders.length > 0 && (
          <div className="selected-orders-list">
            {selectedOrders.map((orderName) => (
              <div key={orderName} className="order-item-wrapper">
                <OrderDetails 
                  orderName={orderName} 
                  onDelete={() => handleRemoveOrder(orderName)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderSetComponent

