import { useState } from 'react'
import { courses, getCourseById } from './data/loadData.js'
import CourseCatalog from './components/CourseCatalog.jsx'
import CoursePage from './components/CoursePage.jsx'

export default function App() {
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const selectedCourse = selectedCourseId ? getCourseById(selectedCourseId) : null

  return (
    <main className="app">
      {selectedCourse ? (
        <CoursePage course={selectedCourse} onBack={() => setSelectedCourseId(null)} />
      ) : (
        <CourseCatalog courses={courses} onSelectCourse={setSelectedCourseId} />
      )}
    </main>
  )
}
