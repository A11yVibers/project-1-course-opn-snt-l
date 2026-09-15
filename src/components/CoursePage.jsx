import { useState } from 'react'
import Syllabus from './Syllabus.jsx'
import MaterialViewer from './MaterialViewer.jsx'

export default function CoursePage({ course, onBack }) {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  return (
    <div className="course-page">
      <div className="course-page__topbar">
        <button className="course-page__back" onClick={onBack}>
          ← Back to catalog
        </button>
      </div>

      <div className={'course-page__panels' + (collapsed ? ' course-page__panels--collapsed' : '')}>
        <section className={'course-page__left' + (collapsed ? ' course-page__left--collapsed' : '')}>
          <button
            className="course-page__collapse-toggle"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand course details' : 'Collapse course details'}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '»' : '«'}
          </button>

          {!collapsed && (
            <div className="course-page__left-content">
              <header className="course-page__header">
                <h1 className="course-page__title">{course.name}</h1>
                {course.instructor && (
                  <div className="course-page__instructor">
                    <img src={course.instructor.photo_url} alt={course.instructor.name} />
                    <div>
                      <p className="course-page__instructor-name">{course.instructor.name}</p>
                      <p className="course-page__instructor-email">{course.instructor.email}</p>
                    </div>
                  </div>
                )}
                <div className="course-page__meta">
                  <span>{course.numberOfWeeks} weeks</span>
                  <span>&middot;</span>
                  <span>{course.numberOfClasses} classes</span>
                </div>
                <p className="course-page__description">{course.longDescription}</p>
              </header>

              <h2 className="course-page__section-title">Syllabus</h2>
              <Syllabus
                classes={course.classes}
                selectedMaterialId={selectedMaterial?.id}
                onSelectMaterial={setSelectedMaterial}
              />
            </div>
          )}
        </section>

        <section className="course-page__right">
          <MaterialViewer course={course} material={selectedMaterial} onClear={() => setSelectedMaterial(null)} />
        </section>
      </div>
    </div>
  )
}
