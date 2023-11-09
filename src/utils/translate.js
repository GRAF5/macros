import * as moveCommand from '../locales/move.command.json';
import * as mainPage from '../locales/main.page.json';

const dictionary = Object.assign(
  {},
  moveCommand,
  mainPage
);


export default function translate(lang, term) {
  if (!dictionary[term]) {
    return term;
  }
  return dictionary[term][lang] || dictionary[term]['en'];
}