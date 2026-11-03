import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Concept from './components/Concept'
import Research from './components/Research'
import Market from './components/Market'
import FocusGroup from './components/FocusGroup'
import Pricing from './components/Pricing'
import Swot from './components/Swot'
import Plan from './components/Plan'
import Footer from './components/Footer'
import './index.css'

function App() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Concept />
        <Research />
        <Market />
        <FocusGroup />
        <Pricing />
        <Swot />
        <Plan />
      </main>
      <Footer />
    </div>
  )
}

export default App
