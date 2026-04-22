import { useState } from 'react'
import { useInvoices } from './InvoiceContext'
import './InvoiceForm.css'

function InvoiceForm({ onDiscard, onSave, existingInvoice }) {

  const { addInvoice, updateInvoice } = useInvoices()

  const [formData, setFormData] = useState(
    existingInvoice || {
      clientName: '',
      clientEmail: '',
      senderStreet: '',
      senderCity: '',
      senderPostCode: '',
      senderCountry: '',
      clientStreet: '',
      clientCity: '',
      clientPostCode: '',
      clientCountry: '',
      date: '',
      paymentTerms: '30',
      description: '',
      items: [{ name: '', quantity: 1, price: 0 }]
    }
  )


  // errors state for validation
  const [errors, setErrors] = useState({})

  // handles all simple field changes
  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // handles item list changes
  function handleItemChange(index, e) {
    const { name, value } = e.target
    const updatedItems = formData.items.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    )
    setFormData(prev => ({ ...prev, items: updatedItems }))
  }

  // adds a new empty item row
  function addItem() {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0 }]
    }))
  }

  // removes an item row
  function removeItem(index) {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  // generates a random invoice id like RT3080
  function generateId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const randomLetters = letters[Math.floor(Math.random() * 26)] +
      letters[Math.floor(Math.random() * 26)]
    const randomNumbers = Math.floor(1000 + Math.random() * 9000)
    return `${randomLetters}${randomNumbers}`
  }

  // calculates total amount from all items
  function calculateTotal() {
    return formData.items.reduce((total, item) => {
      return total + item.quantity * item.price
    }, 0)
  }

  // validates the form
  function validate() {
    const newErrors = {}

    if (!formData.clientName.trim())
      newErrors.clientName = 'Client name is required'

    if (!formData.clientEmail.trim())
      newErrors.clientEmail = 'Client email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.clientEmail))
      newErrors.clientEmail = 'Must be a valid email'

    if (!formData.description.trim())
      newErrors.description = 'Description is required'

    if (!formData.date)
      newErrors.date = 'Date is required'

    if (formData.items.length === 0)
      newErrors.items = 'At least one item is required'

    formData.items.forEach((item, index) => {
      if (!item.name.trim())
        newErrors[`itemName${index}`] = 'Item name is required'
      if (item.quantity <= 0)
        newErrors[`itemQty${index}`] = 'Must be greater than 0'
      if (item.price <= 0)
        newErrors[`itemPrice${index}`] = 'Must be greater than 0'
    })

    return newErrors
  }

  // saves as draft — no validation needed
  function handleDraft() {
    const newInvoice = {
      id: generateId(),
      ...formData,
      amount: calculateTotal(),
      status: 'draft'
    }
    addInvoice(newInvoice)
    onSave()
  }

  function handleSubmit() {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (existingInvoice) {
      // update existing invoice
      updateInvoice(existingInvoice.id, {
        ...formData,
        amount: calculateTotal()
      })
    } else {
      // create new invoice
      const newInvoice = {
        id: generateId(),
        ...formData,
        amount: calculateTotal(),
        status: 'pending'
      }
      addInvoice(newInvoice)
    }
    onSave()
  }

  return (
    <div className="form-container">
      <h2>New Invoice</h2>

      {/* Bill From */}
      <section className="form-section">
        <h3>Bill From</h3>

        <div className="form-group">
          <label htmlFor="senderStreet">Street Address</label>
          <input
            id="senderStreet"
            name="senderStreet"
            type="text"
            value={formData.senderStreet}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="senderCity">City</label>
            <input
              id="senderCity"
              name="senderCity"
              type="text"
              value={formData.senderCity}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="senderPostCode">Post Code</label>
            <input
              id="senderPostCode"
              name="senderPostCode"
              type="text"
              value={formData.senderPostCode}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="senderCountry">Country</label>
            <input
              id="senderCountry"
              name="senderCountry"
              type="text"
              value={formData.senderCountry}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* Bill To */}
      <section className="form-section">
        <h3>Bill To</h3>

        <div className="form-group">
          <label htmlFor="clientName">Client Name</label>
          <input
            id="clientName"
            name="clientName"
            type="text"
            value={formData.clientName}
            onChange={handleChange}
            className={errors.clientName ? 'input-error' : ''}
          />
          {errors.clientName &&
            <span className="error-msg">{errors.clientName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="clientEmail">Client Email</label>
          <input
            id="clientEmail"
            name="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={handleChange}
            className={errors.clientEmail ? 'input-error' : ''}
          />
          {errors.clientEmail &&
            <span className="error-msg">{errors.clientEmail}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="clientStreet">Street Address</label>
          <input
            id="clientStreet"
            name="clientStreet"
            type="text"
            value={formData.clientStreet}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="clientCity">City</label>
            <input
              id="clientCity"
              name="clientCity"
              type="text"
              value={formData.clientCity}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="clientPostCode">Post Code</label>
            <input
              id="clientPostCode"
              name="clientPostCode"
              type="text"
              value={formData.clientPostCode}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="clientCountry">Country</label>
            <input
              id="clientCountry"
              name="clientCountry"
              type="text"
              value={formData.clientCountry}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* Invoice Details */}
      <section className="form-section">
        <h3>Invoice Details</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Invoice Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'input-error' : ''}
            />
            {errors.date &&
              <span className="error-msg">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="paymentTerms">Payment Terms</label>
            <select
              id="paymentTerms"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
            >
              <option value="1">Net 1 Day</option>
              <option value="7">Net 7 Days</option>
              <option value="14">Net 14 Days</option>
              <option value="30">Net 30 Days</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Project Description</label>
          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'input-error' : ''}
          />
          {errors.description &&
            <span className="error-msg">{errors.description}</span>}
        </div>
      </section>

      {/* Item List */}
      <section className="form-section">
        <h3>Item List</h3>

        {errors.items &&
          <span className="error-msg">{errors.items}</span>}

        {formData.items.map((item, index) => (
          <div key={index} className="item-row">
            <div className="form-group">
              <label>Item Name</label>
              <input
                name="name"
                type="text"
                value={item.name}
                onChange={e => handleItemChange(index, e)}
                className={errors[`itemName${index}`] ? 'input-error' : ''}
              />
              {errors[`itemName${index}`] &&
                <span className="error-msg">{errors[`itemName${index}`]}</span>}
            </div>

            <div className="form-group small">
              <label>Qty</label>
              <input
                name="quantity"
                type="number"
                value={item.quantity}
                onChange={e => handleItemChange(index, e)}
                className={errors[`itemQty${index}`] ? 'input-error' : ''}
              />
            </div>

            <div className="form-group small">
              <label>Price</label>
              <input
                name="price"
                type="number"
                value={item.price}
                onChange={e => handleItemChange(index, e)}
                className={errors[`itemPrice${index}`] ? 'input-error' : ''}
              />
            </div>

            <div className="form-group small">
              <label>Total</label>
              <p className="item-total">
                ${(item.quantity * item.price).toFixed(2)}
              </p>
            </div>

            <button
              className="btn-remove-item"
              onClick={() => removeItem(index)}
            >
              ✕
            </button>
          </div>
        ))}

        <button className="btn-add-item" onClick={addItem}>
          + Add New Item
        </button>
      </section>

      {/* Form Buttons */}
      <div className="form-buttons">
        <button className="btn-discard" onClick={onDiscard}>
          Discard
        </button>
        <div className="form-buttons-right">
          <button className="btn-draft" onClick={handleDraft}>
            Save as Draft
          </button>
          <button className="btn-submit" onClick={handleSubmit}>
            Save & Send
          </button>
        </div>
      </div>

    </div>
  )
}

export default InvoiceForm