import { useInvoices } from './InvoiceContext'
import './InvoiceDetail.css'

function InvoiceDetail({ invoiceId, onBack, onDelete, onEdit }) {

  const { invoices, markAsPaid } = useInvoices()

  // find the invoice that matches the id
  const invoice = invoices.find(inv => inv.id === invoiceId)

  // if invoice not found
  if (!invoice) {
    return (
      <div className="detail-container">
        <p>Invoice not found</p>
        <button onClick={onBack}>Go Back</button>
      </div>
    )
  }

  return (
    <div className="detail-container">

      {/* Back Button */}
      <button className="btn-back" onClick={onBack}>
        ← Go Back
      </button>

      {/* Status Bar */}
      <div className="detail-status-bar">
        <div className="status-left">
          <span>Status</span>
          <span className={`status-badge ${invoice.status}`}>
            {invoice.status}
          </span>
        </div>

        <div className="detail-actions">
          {/* Edit button */}
          {invoice.status !== 'paid' && (
  <button className="btn-edit" onClick={onEdit}>
    Edit
  </button>
)}

          {/* Delete button */}
          <button className="btn-delete" onClick={onDelete}>
            Delete
          </button>

          {/* Mark as paid — only shows if pending */}
          {invoice.status === 'pending' && (
            <button
              className="btn-paid"
              onClick={() => markAsPaid(invoice.id)}
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Invoice Info */}
      <div className="detail-card">

        <div className="detail-top">
          <div>
            <p className="invoice-ref">#{invoice.id}</p>
            <p className="invoice-desc">{invoice.description}</p>
          </div>
          <div className="sender-address">
            <p>{invoice.senderStreet}</p>
            <p>{invoice.senderCity}</p>
            <p>{invoice.senderPostCode}</p>
            <p>{invoice.senderCountry}</p>
          </div>
        </div>

        <div className="detail-middle">
          <div className="detail-col">
            <div>
              <p className="detail-label">Invoice Date</p>
              <p className="detail-value">{invoice.date}</p>
            </div>
            <div>
              <p className="detail-label">Payment Due</p>
              <p className="detail-value">Net {invoice.paymentTerms} Days</p>
            </div>
          </div>

          <div className="detail-col">
            <p className="detail-label">Bill To</p>
            <p className="detail-value">{invoice.clientName}</p>
            <p>{invoice.clientStreet}</p>
            <p>{invoice.clientCity}</p>
            <p>{invoice.clientPostCode}</p>
            <p>{invoice.clientCountry}</p>
          </div>

          <div className="detail-col">
            <p className="detail-label">Sent To</p>
            <p className="detail-value">{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="detail-items">
          <div className="items-header">
            <span>Item Name</span>
            <span>QTY.</span>
            <span>Price</span>
            <span>Total</span>
          </div>

          {invoice.items.map((item, index) => (
            <div key={index} className="items-row">
              <span className="item-name">{item.name}</span>
              <span className="item-qty">{item.quantity}</span>
              <span className="item-price">
                ${Number(item.price).toFixed(2)}
              </span>
              <span className="item-total">
                ${(item.quantity * item.price).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="items-total">
            <span>Amount Due</span>
            <span>${Number(invoice.amount).toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default InvoiceDetail