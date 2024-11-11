import Education from "../config/Education"

function EducationLayout() {
    return (
        <div>
            <h1>Educación</h1><br/>
            {
                Education.map((e, i) => {
                return (
                    <div className="row py-1" key={i}>
                    <div className="col-2">
                        <p className="text-year">{e.year}</p>
                    </div>
                    <div className="col-10">
                        <p className="text-title">{e.university} ({e.acronym})</p>
                        <p>{e.degree}: {e.discipline} <a href={e.link} target="_blank" style={{ cursor: 'pointer' }} >
                            <i className="fas fa-external-link-alt"></i>
                        </a>
                        </p>
                        {
                            e.skills.map((s, i2) => {
                                return (
                                <span key={i2} className="badge bg-success me-3">{s}</span>
                                )
                            })
                        }
                    </div>
                    {i < Education.length - 1 && <hr className="mt-3" style={{ color: 'white' }} />}
                    </div>
                )
                })
            }
        </div>
    )
}

export default EducationLayout
