import { Routes, Route } from 'react-router-dom'
import AddExpenses from './pages/AddExpenses'
import './index.css'


function App() {
  return (
    <Routes>
      <Route path="/" element={<AddExpenses />} />
      <Route path="/add-expense" element={<AddExpenses />} />
    </Routes>
  )
}

export default App
