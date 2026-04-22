import { useState } from 'react'
import { useInvoices } from './InvoiceContext'
import './InvoiceList.css'

function InvoiceList({ onNewInvoice, onViewInvoice }) {

  const [filter, setFilter] = useState('all')

  const { invoices } = useInvoices()

  const filteredInvoices = filter === 'all'
    ? invoices
    : invoices.filter(invoice => invoice.status === filter)

  return (
    <div className="invoice-list">

      {/* Header */}
      <div className="invoice-list-header">
        <div className="header-left">
          <h1>Invoices</h1>
          <p>{filteredInvoices.length} invoices</p>
        </div>

        <div className="header-right">
          {/* Filter */}
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={filter === 'all'}
                onChange={() => setFilter('all')}
              />
              All
            </label>
            <label>
              <input
                type="checkbox"
                checked={filter === 'draft'}
                onChange={() => setFilter('draft')}
              />
              Draft
            </label>
            <label>
              <input
                type="checkbox"
                checked={filter === 'pending'}
                onChange={() => setFilter('pending')}
              />
              Pending
            </label>
            <label>
              <input
                type="checkbox"
                checked={filter === 'paid'}
                onChange={() => setFilter('paid')}
              />
              Paid
            </label>
          </div>

          {/* New Invoice Button */}
          <button
            className="btn-new-invoice"
            onClick={onNewInvoice}
          >
            + New Invoice
          </button>
        </div>
      </div>

      {/* Invoice Cards */}
      {filteredInvoices.length === 0 ? (
        <div className="empty-state">
          <p>No invoices found</p>
        </div>
      ) : (
        <div className="invoice-cards">
          {filteredInvoices.map(invoice => (
            <div
              key={invoice.id}
              className="invoice-card"
              onClick={() => onViewInvoice(invoice.id)}
            >
              <span className="invoice-id">#{invoice.id}</span>
              <span className="invoice-client">{invoice.clientName}</span>
              <span className="invoice-amount">
                ${invoice.amount.toFixed(2)}
              </span>
              <span className={`status-badge ${invoice.status}`}>
                {invoice.status}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default InvoiceList