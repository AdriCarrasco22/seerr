type Status = 'PENDING' | 'APPROVED' | 'REJECTED'

const STATUS_CONFIG: Record<Status, { label: string; classes: string }> = {
  PENDING:  { label: 'Pendiente', classes: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
  APPROVED: { label: 'Aprobada',  classes: 'bg-green-500/20  text-green-400  border border-green-500/30'  },
  REJECTED: { label: 'Rechazada', classes: 'bg-red-500/20    text-red-400    border border-red-500/30'    },
}

function RequestStatusBadge({ status }: { status: Status }) {
  const { label, classes } = STATUS_CONFIG[status]
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${classes}`}>
      {label}
    </span>
  )
}

export default RequestStatusBadge