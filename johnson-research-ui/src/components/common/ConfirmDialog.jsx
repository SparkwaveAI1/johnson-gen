import { AlertTriangle, X } from 'lucide-react'

function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger' // 'danger' or 'warning'
}) {
  if (!isOpen) return null

  const confirmButtonClass = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-amber-500 hover:bg-amber-600 text-white'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-cream rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sepia/20">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}>
              <AlertTriangle
                size={20}
                className={variant === 'danger' ? 'text-red-600' : 'text-amber-600'}
              />
            </div>
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-faded-ink hover:text-ink p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-faded-ink">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-4 bg-parchment/50 border-t border-sepia/20">
          <button
            onClick={onCancel}
            className="btn-secondary"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded font-medium transition-colors ${confirmButtonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
