import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourseById } from '../data.js'
import Syllabus from './Syllabus.jsx'
import MaterialViewer from './MaterialViewer.jsx'

export default function CoursePage() {
  const { courseId } = useParams()
  const course = useMemo(() => getCourseById(courseId), [courseId])
  const [collapsed, setCollapsed] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  if (!course) {
    return (
      <div className="course-not-found">
        <p>We couldn't find that course.</p>
        <Link to="/">Back to catalog</Link>
      </div>
    )
  }

  return (
    <div className="course-page">
      <div className={'course-panel-left' + (collapsed ? ' is-collapsed' : '')}>
        <button
          type="button"
          className="panel-collapse-toggle"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? 'Expand course information panel' : 'Collapse course information panel'}
        >
          {collapsed ? '»' : '«'}
        </button>
        {!collapsed && (
          <div className="panel-left-content">
            <Link to="/" className="course-back-link">← All courses</Link>
            <h1 className="course-title">{course.name}</h1>
            {course.instructor && (
              <div className="course-instructor">
                <img src={course.instructor.photo_url} alt={course.instructor.name} />
                <div>
                  <div className="course-instructor-name">{course.instructor.name}</div>
                  <div className="course-instructor-email">{course.instructor.email}</div>
                </div>
              </div>
            )}
            <div className="course-stats">
              <span>{course.number_of_weeks} weeks</span>
              <span>{course.number_of_classes} classes</span>
            </div>
            <p className="course-description">{course.long_description}</p>
            <h2 className="syllabus-heading">Syllabus</h2>
            <Syllabus
              classes={course.classes}
              selectedMaterialId={selectedMaterial?.material_id}
              onSelectMaterial={setSelectedMaterial}
            />
          </div>
        )}
      </div>

      <div className="course-panel-right">
        <MaterialViewer course={course} material={selectedMaterial} />
      </div>
    </div>
  )
}
