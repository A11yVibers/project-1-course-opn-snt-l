import { MATERIAL_TYPE_LABELS } from '../data.js'

const MATERIAL_TYPE_ICONS = {
  pdf: '📄',
  video: '🎬',
  youtube: '▶',
  md: '📝',
  pptx: '📊',
  ppt: '📊',
  doc: '📃',
  docx: '📃',
  link: '🔗',
}

function formatDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Syllabus({ classes, selectedMaterialId, onSelectMaterial }) {
  return (
    <table className="syllabus-table">
      <thead>
        <tr>
          <th>Week</th>
          <th>Date</th>
          <th>Class Content</th>
        </tr>
      </thead>
      <tbody>
        {classes.map((cls) => (
          <tr key={cls.class_id}>
            <td className="syllabus-week">{cls.week_number}</td>
            <td className="syllabus-date">{formatDate(cls.date)}</td>
            <td className="syllabus-content">
              <div className="syllabus-class-title">{cls.class_name}</div>
              {cls.materials.length > 0 ? (
                <ul className="syllabus-materials">
                  {cls.materials.map((material) => (
                    <li key={material.material_id}>
                      <button
                        type="button"
                        className={
                          'syllabus-material-button' +
                          (selectedMaterialId === material.material_id ? ' is-active' : '')
                        }
                        onClick={() => onSelectMaterial(material)}
                      >
                        <span className="syllabus-material-icon" aria-hidden="true">
                          {MATERIAL_TYPE_ICONS[material.material_type] || '📎'}
                        </span>
                        <span className="syllabus-material-title">{material.material_title}</span>
                        <span className="syllabus-material-type">
                          {MATERIAL_TYPE_LABELS[material.material_type] || material.material_type}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="syllabus-no-materials">Materials coming soon.</p>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
