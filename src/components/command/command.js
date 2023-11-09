import React, { useEffect, useState } from 'react';
import translate from '../../utils/translate';
import { useParams } from 'react-router-dom';

const Command = ({type}) => {
  const [rules, setRules] = useState({});
  const { lang } = useParams();

  useEffect(() => {
    getRules();
  }, []);

  function getRules() {
    window?.api?.rules(type)
      .then((res) => setRules(res.rules))
      .catch(err => console.log(err));
  }

  return (
    <div>
      {Object.keys(rules).map(property => {
        return <p key={property}>
          {/* {translate(lang, rules[property].description)} */}
          </p>
      })}
    </div>
  );
}

export default Command;