import { useMemo, useState } from 'react'
import { courses } from './data.js'
import MaterialViewer from './MaterialViewer.jsx'

const MATERIAL_ICONS = {
  pdf: '📄',
  video: '🎬',
  youtube: '▶️',
  md: '📝',
}

function materialLabel(type) {
  switch (type) {
    case 'pdf':
      return 'Reading (PDF)'
    case 'video':
      return 'Lecture Video'
    case 'youtube':
      return 'Video'
    case 'md':
      return 'Assignment'
    default:
      return 'Material'
  }
}

function CourseCard({ course, onSelect }) {
  return (
    <button className="course-card" onClick={() => onSelect(course.course_id)}>
      <div
        className="course-card__image"
        style={{ backgroundImage: `url(${course.image_url})` }}
      />
      <div className="course-card__body">
        <h3>{course.name}</h3>
        <p>{course.short_description}</p>
        <div className="course-card__meta">
          <span>{course.number_of_weeks} weeks</span>
          <span>{course.number_of_classes} classes</span>
        </div>
        {course.instructor && (
          <div className="course-card__instructor">
            <img src={course.instructor.photo_url} alt="" />
            <span>{course.instructor.name}</span>
          </div>
        )}
      </div>
    </button>
  )
}

function Catalog({ onSelectCourse }) {
  const [query, setQuery] = useState('')
  const [instructorFilter, setInstructorFilter] = useState('all')

  const instructorOptions = useMemo(() => {
    const map = new Map()
    for (const c of courses) {
      if (c.instructor) map.set(c.instructor.instructor_id, c.instructor.name)
    }
    return Array.from(map.entries())
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return courses.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.short_description.toLowerCase().includes(q) ||
        c.long_description.toLowerCase().includes(q)
      const matchesInstructor =
        instructorFilter === 'all' || c.instructor_id === instructorFilter
      return matchesQuery && matchesInstructor
    })
  }, [query, instructorFilter])

  return (
    <div className="catalog">
      <header className="catalog__hero">
        <h1>Chronicle History Academy</h1>
        <p>Guided courses on the civilizations, conflicts, and ideas that shaped the world.</p>
      </header>

      <div className="catalog__controls">
        <input
          type="search"
          placeholder="Search courses by title or topic..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search courses"
        />
        <select
          value={instructorFilter}
          onChange={(e) => setInstructorFilter(e.target.value)}
          aria-label="Filter by instructor"
        >
          <option value="all">All instructors</option>
          {instructorOptions.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <p className="catalog__count">
        {filtered.length} course{filtered.length === 1 ? '' : 's'}
      </p>

      <div className="catalog__grid">
        {filtered.map((course) => (
          <CourseCard key={course.course_id} course={course} onSelect={onSelectCourse} />
        ))}
        {filtered.length === 0 && (
          <p className="catalog__empty">No courses match your search.</p>
        )}
      </div>
    </div>
  )
}

function MaterialList({ classItem, activeMaterialId, onSelectMaterial }) {
  if (!classItem.materials.length) {
    return <p className="material-list__empty">No materials posted yet.</p>
  }
  return (
    <ul className="material-list">
      {classItem.materials.map((m) => (
        <li key={m.material_id}>
          <button
            className={
              'material-list__item' +
              (activeMaterialId === m.material_id ? ' is-active' : '')
            }
            onClick={() => onSelectMaterial(m)}
          >
            <span className="material-list__icon">{MATERIAL_ICONS[m.material_type] || '📎'}</span>
            <span className="material-list__title">{m.material_title}</span>
            <span className="material-list__type">{materialLabel(m.material_type)}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function Syllabus({ course, activeMaterialId, onSelectMaterial }) {
  return (
    <table className="syllabus">
      <thead>
        <tr>
          <th>Week</th>
          <th>Date</th>
          <th>Class Content</th>
        </tr>
      </thead>
      <tbody>
        {course.classes.map((cls) => (
          <tr key={cls.class_id}>
            <td className="syllabus__week">{cls.week_number}</td>
            <td className="syllabus__date">
              {new Date(cls.date + 'T00:00:00').toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </td>
            <td className="syllabus__content">
              <div className="syllabus__class-title">{cls.class_name}</div>
              <MaterialList
                classItem={cls}
                activeMaterialId={activeMaterialId}
                onSelectMaterial={(m) => onSelectMaterial(m, cls)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CoursePage({ course, onBack }) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeMaterial, setActiveMaterial] = useState(null)

  return (
    <div className="course-page">
      <div className="course-page__topbar">
        <button className="back-button" onClick={onBack}>
          ← Back to catalog
        </button>
      </div>
      <div className={'course-page__layout' + (collapsed ? ' is-collapsed' : '')}>
        <section className="course-page__left">
          <button
            className="collapse-toggle"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? 'Expand course panel' : 'Collapse course panel'}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '»' : '«'}
          </button>
          <div className="course-page__left-inner">
            <h1>{course.name}</h1>
            {course.instructor && (
              <div className="course-instructor">
                <img src={course.instructor.photo_url} alt="" />
                <div>
                  <div className="course-instructor__name">{course.instructor.name}</div>
                  <div className="course-instructor__email">{course.instructor.email}</div>
                </div>
              </div>
            )}
            <p className="course-page__description">{course.long_description}</p>
            <div className="course-page__stats">
              <span>{course.number_of_weeks} weeks</span>
              <span>{course.number_of_classes} classes</span>
            </div>

            <h2>Syllabus</h2>
            <Syllabus
              course={course}
              activeMaterialId={activeMaterial?.material_id}
              onSelectMaterial={(m) => setActiveMaterial(m)}
            />
          </div>
        </section>

        <section className="course-page__right">
          <MaterialViewer
            material={activeMaterial}
            fallbackImage={course.image_url}
            courseName={course.name}
            onClose={() => setActiveMaterial(null)}
          />
        </section>
      </div>
    </div>
  )
}

export default function App() {
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const course = useMemo(
    () => courses.find((c) => c.course_id === selectedCourseId) || null,
    [selectedCourseId]
  )

  if (course) {
    return <CoursePage course={course} onBack={() => setSelectedCourseId(null)} />
  }

  return <Catalog onSelectCourse={setSelectedCourseId} />
}
