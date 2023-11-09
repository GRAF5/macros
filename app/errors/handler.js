'use strict';

function compose(err) {
  let response = {
    error: err.name,
    message: err.message
  };
  return response;
}

module.exports = {
  compose
}