import { formatDate, materialTypeIcon, materialTypeLabel } from '../utils/format.js'

export default function Syllabus({ classes, selectedMaterialId, onSelectMaterial }) {
  return (
    <table className="syllabus">
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
            <td className="syllabus__week">{klass.weekNumber}</td>
            <td className="syllabus__date">{formatDate(klass.date)}</td>
            <td className="syllabus__content">
              <p className="syllabus__class-name">{klass.name}</p>
              {klass.materials.length > 0 ? (
                <ul className="syllabus__materials">
                  {klass.materials.map((material) => (
                    <li key={material.id}>
                      <button
                        className={
                          'syllabus__material' +
                          (material.id === selectedMaterialId ? ' syllabus__material--active' : '')
                        }
                        onClick={() => onSelectMaterial(material)}
                      >
                        <span className="syllabus__material-icon" aria-hidden="true">
                          {materialTypeIcon(material.type)}
                        </span>
                        <span className="syllabus__material-title">{material.title}</span>
                        <span className="syllabus__material-type">{materialTypeLabel(material.type)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="syllabus__no-materials">Materials coming soon.</p>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
