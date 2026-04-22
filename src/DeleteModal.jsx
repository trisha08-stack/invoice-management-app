import { useEffect, useRef } from 'react'
import './DeleteModal.css'

function DeleteModal({ invoiceId, onConfirm, onCancel }) {

  // ref to trap focus inside modal
  const modalRef = useRef(null)

  // close modal when ESC key is pressed
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  // focus the modal when it opens
  useEffect(() => {
    modalRef.current?.focus()
  }, [])

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        ref={modalRef}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete invoice #{invoiceId}?
          This action cannot be undone.
        </p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal