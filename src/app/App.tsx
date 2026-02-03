import { Routes, Route, Navigate } from 'react-router-dom'
import CosplayerProfilePage from '../features/profile/pages/CosplayerProfilePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/profile" replace />} />
      <Route path="/profile" element={<CosplayerProfilePage />} />
    </Routes>
  )
}
