import WorkExperience from "../config/WorkExperience"

function WorkExperienceLayout() {
    return (
        <div>
            <h1>Experiencia Laboral</h1><br/>
        {
            WorkExperience.map((e, i) => {
                return (
                    <div className="row py-1" key={i}>
                        <div className="col-2">
                            <p className="text-year">{e.year}</p>
                        </div>
                        <div className="col-10">
                            <span className="text-title">{e.company}</span>
                            <p><b>Cargo:</b> {e.position}</p>

                            <span><b>Funciones:</b></span>
                            <br/>
                            {
                                e.functions.map((f, i2) => {
                                    return (
                                        <div key={i2}><span>• {f}</span><br/></div>
                                    )
                                })
                            }
                            <br/>

                            <span><b>Habilidades: </b>{
                                e.skills.map((s, i2) => {
                                    return (
                                        <span key={i2} class="badge bg-success me-3">{s}</span>
                                    )
                                })
                            }</span>
                        </div>
                        {i < WorkExperience.length - 1 && <hr className="mt-3" style={{ color: 'white' }}></hr>}
                    </div>
                )
            })
        }
        </div>
    )
}

export default WorkExperienceLayout