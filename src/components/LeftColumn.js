import SocialLinks from '../config/SocialLinks'
import Navigation from '../config/Navigation'

function LeftColumn({ selectedLink, handleLinkClick }) {
    return (
        <div>
            <h1><b>Omar Atarama</b></h1>
            <h5><b>Economista | Ingeniero de Datos Jr.</b></h5>
            <br/>
            <div>
                <ul class="list-unstyled">
                { Navigation.map((e, i) => <li key={i}><a className={selectedLink === e.url ? 'selected-link' : ''} onClick={() => handleLinkClick(e.url)}>✨ {e.name}</a></li>) }
                </ul>
            </div>
            <br/>
            <div class="social-icons-container">
            { SocialLinks.map((e, i) => <a key={i} href={e.url} target="_blank"><i class={e.icon}></i></a>) }
            </div>
        </div>
    )
}

export default LeftColumn