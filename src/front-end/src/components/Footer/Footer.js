
import logo from "../../imgs/whiteLogo.png"
import './Footer.css'

function Footer(){
    return(
        <div className="Footer">
            <div className='Footer_left'>
                <img src={logo} alt=""/>
                <p>Copyright by Reflow © 2023. All right reserved.</p>
            </div>
            <div className='Footer_right'>
                <div>
                    <ion-icon name="logo-facebook"></ion-icon>
                    <span>Reflow</span>
                </div>
                <div>
                    <ion-icon name="logo-tiktok"></ion-icon>
                    <span>Reflow</span>
                </div>
                <div>
                    <ion-icon name="mail"></ion-icon>
                    <span>reflow@contact.com</span>
                </div>
            </div>
        </div>
    )
}

export default Footer;