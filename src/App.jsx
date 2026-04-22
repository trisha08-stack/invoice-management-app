import { useState } from 'react'
import './App.css'
import Sidebar from './Sidebar'
import InvoiceList from './InvoiceList'
import InvoiceForm from './InvoiceForm'
import InvoiceDetail from './InvoiceDetail'
import DeleteModal from './DeleteModal'
import { useInvoices } from './InvoiceContext'

function App() {
  const [page, setPage] = useState('list')
  const [selectedId, setSelectedId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)

  const { deleteInvoice, invoices } = useInvoices()

  function handleViewInvoice(id) {
    setSelectedId(id)
    setPage('detail')
  }

  function handleDeleteConfirm() {
    deleteInvoice(selectedId)
    setShowDeleteModal(false)
    setPage('list')
  }

  function handleEdit() {
    const invoice = invoices.find(inv => inv.id === selectedId)
    setEditingInvoice(invoice)
    setPage('form')
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">

        {page === 'list' && (
          <InvoiceList
            onNewInvoice={() => {
              setEditingInvoice(null)
              setPage('form')
            }}
            onViewInvoice={handleViewInvoice}
          />
        )}

        {page === 'form' && (
          <InvoiceForm
            existingInvoice={editingInvoice}
            onDiscard={() => setPage('list')}
            onSave={() => setPage('list')}
          />
        )}

        {page === 'detail' && (
          <InvoiceDetail
            invoiceId={selectedId}
            onBack={() => setPage('list')}
            onDelete={() => setShowDeleteModal(true)}
            onEdit={handleEdit}
          />
        )}

        {showDeleteModal && (
          <DeleteModal
            invoiceId={selectedId}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}

      </main>
    </div>
  )
}

export default App