import React from 'react';
import './footer.css';
import ThemeSwitch from '../themeswitch/themeswitch';
import LanguageSwitch from '../languageSwitch/languageSwitch';

const Footer = () => {

  return (
    <footer>
      <div className='left'>

      </div>
      <div className='right'>
        <LanguageSwitch/>
        <ThemeSwitch/>
      </div>
    </footer>
  )
}

export default Footer;