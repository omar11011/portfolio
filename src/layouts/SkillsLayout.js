import { useEffect } from 'react'
import '../assets/css/Skills.css'
import Skills from '../config/Skills'

function SkillsLayout() {
    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        tooltipTriggerList.forEach(tooltipTriggerEl => {
        new window.bootstrap.Tooltip(tooltipTriggerEl)
        })
    }, [])

    return (
        <div>
            <h1>Skills</h1><br />
            <div className="skills-container">
            {
                Skills.map((e, i) => {
                    return (
                        <span className="d-inline-block" tabIndex="0" data-bs-toggle="tooltip" title={e.name} key={i}>
                            <img src={`/images/skills/${e.image}.png`} alt={e.name} className="skill-icon" />
                        </span>
                    )
                })
            }
            </div>
        </div>
    )
}

export default SkillsLayout
