import { createContext, useContext, useState, useEffect } from 'react'

const InvoiceContext = createContext()

export function InvoiceProvider({ children }) {

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices))
  }, [invoices])

  function addInvoice(invoice) {
    setInvoices(prev => [...prev, invoice])
  }

  function updateInvoice(id, updatedInvoice) {
    setInvoices(prev =>
      prev.map(invoice =>
        invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
      )
    )
  }

  function deleteInvoice(id) {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id))
  }

  
  function markAsPaid(id) {
    setInvoices(prev =>
      prev.map(invoice =>
        invoice.id === id ? { ...invoice, status: 'paid' } : invoice
      )
    )
  }

  return (
    <InvoiceContext.Provider value={{
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPaid
    }}>
      {children}
    </InvoiceContext.Provider>
  )
}

export function useInvoices() {
  return useContext(InvoiceContext)
}