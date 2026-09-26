import { HashRouter, Route, Routes } from 'react-router-dom'
import Catalog from './components/Catalog.jsx'
import CoursePage from './components/CoursePage.jsx'

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
