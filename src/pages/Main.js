import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Command from '../components/command/command';
import Mousetrap from 'mousetrap';
import 'mousetrap/plugins/record/mousetrap-record'
import Titlebar from '../components/titlebar/titlebar';
import translate from '../utils/translate';
import './Main.css';

const Main = () => {
  const [macros, setMacros] = useState([{
    title: 'Test Macro',
    description: 'Description',
    shortcut: 'ctrl+i'
  }]);
  let { lang } = useParams();

  useEffect(() => {
    getMacros();
  }, [])

  function getMacros() {
    window?.api?.macros()
      .then(res => setMacros(res.macros));
  }

  function recordSequence() {
    Mousetrap.record(function(sequence) {
      window?.api?.register(sequence[0]);
    });
}

  return (
    <>
      <Titlebar title={translate(lang, 'main.page.title')}/>
      <div id='content'>
        <div id='container'>
          <h2>{translate(lang, 'main.page.title')}</h2>
          {
            macros.map((macro, index) => 
              <div key={macro.title + index} className='macro'>
                <div id='info'>
                  <h3>{macro.title}</h3>
                  <p>{macro.description}</p>
                </div>
                <div id='manage'>
                  <button style={{marginRight: '10px'}}>Start ({macro?.shortcut})</button>
                  <button className='outlined danger'>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg"  
                      viewBox="0 0 50 50" 
                      width="20px" 
                      height="20px">
                      <path fill='currentColor' d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"/>
                    </svg>
                  </button>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </>
  )
};

export default Main;