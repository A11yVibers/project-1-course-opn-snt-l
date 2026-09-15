import Papa from 'papaparse'

import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'

import { LOCAL_MATERIAL_FILES } from './materialAssets.js'

function parseCsv(raw) {
  // Source CSVs may contain mixed CRLF/LF line endings; normalize before parsing
  // so Papa Parse reliably detects row boundaries.
  const normalized = raw.replace(/\r\n/g, '\n').trim()
  const { data } = Papa.parse(normalized, { header: true, skipEmptyLines: true })
  return data
}

function resolveMaterialSource(materialType, filePath) {
  if (materialType === 'youtube') {
    return { url: filePath, text: null }
  }
  const local = LOCAL_MATERIAL_FILES[filePath]
  if (local) return local
  // Fall back to treating the path as a direct URL if it isn't a known local file.
  return { url: filePath, text: null }
}

function buildData() {
  const instructorsRaw = parseCsv(instructorsCsv)
  const coursesRaw = parseCsv(coursesCsv)
  const classesRaw = parseCsv(classesCsv)
  const materialsRaw = parseCsv(materialsCsv)

  const instructorsById = new Map(instructorsRaw.map((row) => [row.instructor_id, row]))

  const materialsByClassId = new Map()
  for (const row of materialsRaw) {
    const list = materialsByClassId.get(row.class_id) || []
    const source = resolveMaterialSource(row.material_type, row.file_path)
    list.push({
      id: row.material_id,
      classId: row.class_id,
      courseId: row.course_id,
      title: row.material_title,
      type: row.material_type,
      displayOrder: Number(row.display_order),
      filePath: row.file_path,
      ...source,
    })
    materialsByClassId.set(row.class_id, list)
  }
  for (const list of materialsByClassId.values()) {
    list.sort((a, b) => a.displayOrder - b.displayOrder)
  }

  const classesByCourseId = new Map()
  for (const row of classesRaw) {
    const list = classesByCourseId.get(row.course_id) || []
    list.push({
      id: row.class_id,
      courseId: row.course_id,
      weekNumber: Number(row.week_number),
      date: row.date,
      name: row.class_name,
      materials: materialsByClassId.get(row.class_id) || [],
    })
    classesByCourseId.set(row.course_id, list)
  }
  for (const list of classesByCourseId.values()) {
    list.sort((a, b) => a.date.localeCompare(b.date))
  }

  const courses = coursesRaw.map((row) => ({
    id: row.course_id,
    name: row.name,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    numberOfClasses: Number(row.number_of_classes),
    numberOfWeeks: Number(row.number_of_weeks),
    instructorId: row.instructor_id,
    instructor: instructorsById.get(row.instructor_id) || null,
    imageUrl: row.image_url,
    classes: classesByCourseId.get(row.course_id) || [],
  }))

  return { courses, instructors: instructorsRaw }
}

export const { courses, instructors } = buildData()

export function getCourseById(courseId) {
  return courses.find((course) => course.id === courseId) || null
}
