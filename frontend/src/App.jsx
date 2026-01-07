import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from './pages/Home' 
import Output from './pages/Output'
function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/output" element={<Output />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
