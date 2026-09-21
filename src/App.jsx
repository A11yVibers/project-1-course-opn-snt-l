import { useState } from 'react'
import { courses, getCourseById } from './data/loadData.js'
import CourseCatalog from './components/CourseCatalog.jsx'
import CoursePage from './components/CoursePage.jsx'

export default function App() {
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const selectedCourse = selectedCourseId ? getCourseById(selectedCourseId) : null

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="app-header">
        <button type="button" className="app-header__brand" onClick={() => setSelectedCourseId(null)}>
          <span className="app-header__logo" aria-hidden="true">
            🏛️
          </span>
          <span className="app-header__name">Chronicle</span>
        </button>
        <p className="app-header__tagline">A digital home for history learning</p>
      </header>

      <main id="main-content">
        {selectedCourse ? (
          <CoursePage course={selectedCourse} onBack={() => setSelectedCourseId(null)} />
        ) : (
          <CourseCatalog courses={courses} onSelectCourse={setSelectedCourseId} />
        )}
      </main>
    </div>
  )
}
