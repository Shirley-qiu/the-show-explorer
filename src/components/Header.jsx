import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAdjust, faFilm } from '@fortawesome/free-solid-svg-icons';


class Header extends Component {
   
   render() {
      const { toggleTheme } = this.props;
      return (
         <div className="headerComponent">
               <div className="headerTitle"><h3><FontAwesomeIcon icon={faFilm} /> &nbsp;&nbsp; The Show Explorer</h3></div>
               <div className="headerElements">
                  <Link className="homeLink" to="/"><h5><FontAwesomeIcon icon={faHome} />&nbsp; Home</h5></Link>
                  <FontAwesomeIcon className="themeBtn" icon={faAdjust} size="2x" onClick={toggleTheme} />
                  <span className="themeText" onClick={toggleTheme}>&nbsp; <b>Toggle Theme</b></span>
               </div>
         </div>
      );
   }
   
};

export default Header;
