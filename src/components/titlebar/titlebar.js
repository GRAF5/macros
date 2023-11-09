import React from 'react';
import './titlebar.css';

const Titlebar = ({title}) => {

  return (
    <div id='titlebar'>
      <div className='left'></div>
      <div className='center'>
        <small>{title}</small>
      </div>
      <div className='right'></div>
    </div>
  )
}

export default Titlebar;