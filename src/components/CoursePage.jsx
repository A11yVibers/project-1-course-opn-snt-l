import { useState } from 'react'
import Syllabus from './Syllabus.jsx'
import MaterialViewer from './MaterialViewer.jsx'

export default function CoursePage({ course, onBack }) {
  const [panelOpen, setPanelOpen] = useState(true)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  return (
    <div className="course-page">
      <div className="course-page__topbar">
        <button type="button" className="back-link" onClick={onBack}>
          ← Back to catalog
        </button>
      </div>

      <div className={'course-page__layout' + (panelOpen ? '' : ' course-page__layout--collapsed')}>
        <section
          className="course-page__panel"
          aria-label="Course information and syllabus"
          hidden={!panelOpen}
        >
          <header className="course-info">
            <h1>{course.name}</h1>
            {course.instructor && (
              <div className="course-info__instructor">
                <img
                  src={course.instructor.photo_url}
                  alt={course.instructor.name}
                  className="course-info__instructor-photo"
                />
                <div>
                  <p className="course-info__instructor-name">{course.instructor.name}</p>
                  <a href={`mailto:${course.instructor.email}`} className="course-info__instructor-email">
                    {course.instructor.email}
                  </a>
                </div>
              </div>
            )}
            <p className="course-info__meta">
              {course.numberOfWeeks} weeks · {course.numberOfClasses} classes
            </p>
            <p className="course-info__description">{course.longDescription}</p>
          </header>

          <Syllabus
            classes={course.classes}
            selectedMaterialId={selectedMaterial?.id}
            onSelectMaterial={setSelectedMaterial}
          />
        </section>

        <button
          type="button"
          className="course-page__toggle"
          onClick={() => setPanelOpen((open) => !open)}
          aria-expanded={panelOpen}
          aria-label={panelOpen ? 'Collapse course information panel' : 'Expand course information panel'}
        >
          {panelOpen ? '‹' : '›'}
        </button>

        <section className="course-page__viewer" aria-label="Material viewer">
          <MaterialViewer material={selectedMaterial} course={course} />
        </section>
      </div>
    </div>
  )
}
