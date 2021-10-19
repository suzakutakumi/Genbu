exports.nullValue = {
  type: 'NullValue',
}

exports.intValue = function (value) {
  return {
    type: 'IntValue',
    value,
  }
}

exports.boolValue = function (value) {
  return {
    type: 'BoolValue',
    value,
  }
}

exports.emptyEnvironment = {
  variables: new Map(),
  functions: new Map(),
}
