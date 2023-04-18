import {Link, withRouter} from 'react-router-dom'

import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="header-container">
      <div className="nav-content">
        <Link to="/">
          <img
            className="header-website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul className="nav-menu">
          <Link to="/" className="nav-link">
            <li className="menu">Home</li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li className="menu">Jobs</li>
          </Link>
        </ul>
        <button
          type="button"
          className="logout-desktop-btn"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
      <div className="nav-menu-mobile">
        <Link to="/">
          <img
            className="header-website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul className="nav-menu-list-mobile">
          <Link to="/" className="nav-link">
            <li>
              <button type="button" className="icon-btn">
                <AiFillHome className="header-icon" />
              </button>
            </li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li>
              <button type="button" className="icon-btn">
                <BsBriefcaseFill className="header-icon" />
              </button>
            </li>
          </Link>
          <button
            type="button"
            className="icon-btn logout"
            onClick={onClickLogout}
          >
            <FiLogOut className="header-icon" />
          </button>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
