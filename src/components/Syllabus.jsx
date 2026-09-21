import { materialIcon } from './MaterialViewer.jsx'

function formatDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Syllabus({ classes, selectedMaterialId, onSelectMaterial }) {
  return (
    <table className="syllabus-table">
      <caption className="syllabus-table__caption">Course Syllabus</caption>
      <thead>
        <tr>
          <th scope="col">Week</th>
          <th scope="col">Date</th>
          <th scope="col">Class Content</th>
        </tr>
      </thead>
      <tbody>
        {classes.map((klass) => (
          <tr key={klass.id}>
            <td>{klass.weekNumber}</td>
            <td>{formatDate(klass.date)}</td>
            <td>
              <p className="syllabus-table__class-title">{klass.name}</p>
              {klass.materials.length > 0 ? (
                <ul className="syllabus-table__materials">
                  {klass.materials.map((material) => (
                    <li key={material.id}>
                      <button
                        type="button"
                        className={
                          'material-link' +
                          (material.id === selectedMaterialId ? ' material-link--active' : '')
                        }
                        onClick={() => onSelectMaterial(material)}
                        aria-pressed={material.id === selectedMaterialId}
                      >
                        <span aria-hidden="true">{materialIcon(material)}</span>
                        {material.title}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="syllabus-table__no-materials">No materials posted yet.</p>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
