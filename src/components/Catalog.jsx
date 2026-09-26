import { useMemo, useState } from 'react'
import { courses, instructorsById } from '../data.js'
import CourseCard from './CourseCard.jsx'

const instructorOptions = Object.values(instructorsById).sort((a, b) => a.name.localeCompare(b.name))

export default function Catalog() {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    let list = courses.filter((course) => {
      const matchesQuery =
        normalized.length === 0 ||
        course.name.toLowerCase().includes(normalized) ||
        course.short_description.toLowerCase().includes(normalized) ||
        course.long_description.toLowerCase().includes(normalized)
      const matchesInstructor = instructorId === 'all' || course.instructor_id === instructorId
      return matchesQuery && matchesInstructor
    })
    list = [...list].sort((a, b) => {
      if (sortBy === 'weeks') return a.number_of_weeks - b.number_of_weeks
      if (sortBy === 'classes') return a.number_of_classes - b.number_of_classes
      return a.name.localeCompare(b.name)
    })
    return list
  }, [query, instructorId, sortBy])

  return (
    <div className="catalog">
      <header className="catalog-hero">
        <p className="catalog-kicker">History Learning Platform</p>
        <h1>Step into the past, twelve courses at a time.</h1>
        <p className="catalog-subtitle">
          Search and filter courses spanning ancient civilizations to the twentieth century,
          each with a full syllabus and ready-to-view materials.
        </p>
      </header>

      <div className="catalog-controls">
        <input
          type="search"
          placeholder="Search courses by topic, era, or keyword…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search courses"
        />
        <select value={instructorId} onChange={(event) => setInstructorId(event.target.value)} aria-label="Filter by instructor">
          <option value="all">All instructors</option>
          {instructorOptions.map((instructor) => (
            <option key={instructor.instructor_id} value={instructor.instructor_id}>{instructor.name}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort courses">
          <option value="name">Sort: Title (A–Z)</option>
          <option value="weeks">Sort: Duration (weeks)</option>
          <option value="classes">Sort: Number of classes</option>
        </select>
      </div>

      <p className="catalog-count">{filtered.length} of {courses.length} courses</p>

      <div className="catalog-grid">
        {filtered.map((course) => <CourseCard key={course.course_id} course={course} />)}
        {filtered.length === 0 && <p className="catalog-empty">No courses match your search.</p>}
      </div>
    </div>
  )
}
