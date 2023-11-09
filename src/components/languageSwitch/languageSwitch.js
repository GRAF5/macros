import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './languageSwitch.css';

const LanguageSwitch = () => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const languages = ['uk', 'en'];
  let location = useLocation();
  let redirect = useNavigate();

  function change(ln) {
    localStorage.setItem('language', ln);
    let path = location.pathname.split('/');
    path[1] = ln;
    redirect(path.join('/'));
    setLanguage(ln);
    document.getElementById('language-switch').removeAttribute('open');
  }

  function getLocale(l = 'en') {
    let locale = (new Intl.DisplayNames([l], {type: 'language'})).of(l);
    return `${locale.charAt(0).toUpperCase()}${locale.substring(1)}(${l.toUpperCase()})`;
  }

  return (
    <details id='language-switch'>
      <span>
        {
          languages.map(l => <p key={l} onClick={() => change(l)}>{getLocale(l)}</p>)
        }
      </span>
      <summary>{getLocale(language)}</summary>
    </details>
  );
}

export default LanguageSwitch;