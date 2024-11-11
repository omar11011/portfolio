import { useState } from 'react'

import LeftColumn from '../components/LeftColumn'
import Footer from '../components/Footer'

import AboutLayout from '../layouts/AboutLayout'
import EducationLayout from '../layouts/EducationLayout'
import WorkExperienceLayout from '../layouts/WorkExperienceLayout'
import SkillsLayout from '../layouts/SkillsLayout'

function Portfolio() {
  const [selectedLink, setSelectedLink] = useState(null)

  const handleLinkClick = link => setSelectedLink(link)

  return (
    <div className='d-flex flex-column' style={{ minHeight: "100vh" }}>
      <div className="container-fluid row flex-grow-1">
        <div className="col-lg-5 col-sm-12">
          <div className="container p-5">
            <LeftColumn selectedLink={selectedLink} handleLinkClick={handleLinkClick} />
          </div>
        </div>
        <div className="col-lg-7 col-sm-12">
          <div className="container p-5">
              { !selectedLink && <div>Hola</div> }
              { selectedLink && selectedLink === 'about' && <AboutLayout/> }
              { selectedLink && selectedLink === 'education' && <EducationLayout/> }
              { selectedLink && selectedLink === 'work-experience' && <WorkExperienceLayout/> }
              { selectedLink && selectedLink === 'skills' && <SkillsLayout/> }
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Portfolio