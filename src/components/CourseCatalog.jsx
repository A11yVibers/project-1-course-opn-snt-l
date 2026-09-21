import { useMemo, useState } from 'react'
import CourseCard from './CourseCard.jsx'

export default function CourseCatalog({ courses, onSelectCourse }) {
  const [query, setQuery] = useState('')
  const [instructorFilter, setInstructorFilter] = useState('all')

  const instructorOptions = useMemo(() => {
    const map = new Map()
    courses.forEach((course) => {
      if (course.instructor) {
        map.set(course.instructor.instructor_id, course.instructor.name)
      }
    })
    return Array.from(map, ([id, name]) => ({ id, name }))
  }, [courses])

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesQuery =
        !normalizedQuery ||
        course.name.toLowerCase().includes(normalizedQuery) ||
        course.shortDescription.toLowerCase().includes(normalizedQuery) ||
        course.longDescription.toLowerCase().includes(normalizedQuery)

      const matchesInstructor =
        instructorFilter === 'all' || course.instructor?.instructor_id === instructorFilter

      return matchesQuery && matchesInstructor
    })
  }, [courses, query, instructorFilter])

  return (
    <div className="catalog">
      <header className="catalog__hero">
        <h1>History Courses</h1>
        <p>Explore civilizations, empires, and turning points across the human past.</p>
      </header>

      <div className="catalog__controls">
        <label className="catalog__search">
          <span className="sr-only">Search courses</span>
          <input
            type="search"
            placeholder="Search courses by name or topic…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <label className="catalog__filter">
          <span className="sr-only">Filter by instructor</span>
          <select value={instructorFilter} onChange={(event) => setInstructorFilter(event.target.value)}>
            <option value="all">All instructors</option>
            {instructorOptions.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="catalog__result-count">
        {filteredCourses.length} course{filteredCourses.length === 1 ? '' : 's'} found
      </p>

      <div className="catalog__grid">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} onSelect={onSelectCourse} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <p className="catalog__empty">No courses match your search. Try a different keyword.</p>
      )}
    </div>
  )
}
