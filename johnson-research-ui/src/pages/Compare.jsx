import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function Compare() {
  const { id1, id2 } = useParams()

  return (
    <div className="space-y-6">
      <Link to="/identity" className="text-faded-ink hover:text-ink flex items-center gap-1">
        <ArrowLeft size={16} />
        Back to Identity Queue
      </Link>
      <div className="card">
        <h1>Compare Identities</h1>
        <p className="text-faded-ink mt-2">
          Comparing {id1} with {id2}
        </p>
        <p className="text-faded-ink mt-4">
          Side-by-side comparison view coming soon.
        </p>
      </div>
    </div>
  )
}

export default Compare
