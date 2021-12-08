function isDigit(char) {
  const charCode = char.charCodeAt(0)
  return '0'.charCodeAt(0) <= charCode && charCode <= '9'.charCodeAt(0)
}

function isIdentChar(char) {
  const charCode = char.charCodeAt(0)
  return 'a'.charCodeAt(0) <= charCode && charCode <= 'z'.charCodeAt(0)
}

function countDigits(source) {
  let readPosition = 0
  while (readPosition < source.length) {
    if (!isDigit(source[readPosition])) {
      return readPosition
    }
    readPosition += 1
  }
  return readPosition
}

function countIdentChars(source) {
  let readPosition = 0
  while (readPosition < source.length) {
    if (!isIdentChar(source[readPosition])) {
      return readPosition
    }
    readPosition += 1
  }
  return readPosition
}

module.exports.lexicalAnalyse = function (source) {
  const tokens = []
  let readPosition = 0
  while (readPosition < source.length) {
    switch (source[readPosition]) {
      case '#':
        readPosition += 1
        if (source[readPosition] === '<') {
          readPosition += 1
          while (readPosition < source.length && source[readPosition] !== '>') {
            if (source[readPosition] === '\\') {
              readPosition += 1
            }
            readPosition += 1
          }
          if (readPosition >= source.length) {
            tokens.push({
              type: 'Error',
              value: 'コメントの終わりがねえぞ',
            })
          }
        } else {
          while (readPosition < source.length && source[readPosition] !== '\n') {
            readPosition += 1
          }
        }
        readPosition += 1
        break
      case '=':
        tokens.push({ type: 'Equal' })
        readPosition += 1
        break
      case '+':
        tokens.push({ type: 'Plus' })
        readPosition += 1
        break
      case '(':
        tokens.push({ type: 'LParen' })
        readPosition += 1
        break
      case ')':
        tokens.push({ type: 'RParen' })
        readPosition += 1
        break
      case '{':
        tokens.push({ type: 'LBrace' })
        readPosition += 1
        break
      case '}':
        tokens.push({ type: 'RBrace' })
        readPosition += 1
        break
      case ',':
        tokens.push({ type: 'Comma' })
        readPosition += 1
        break
      case ';':
        tokens.push({ type: 'Semicolon' })
        readPosition += 1
        break
      case '"': {
        readPosition += 1
        let currentPos = readPosition
        let str = ''
        while (currentPos < source.length && source[currentPos] !== '"') {
          if (source[currentPos] === '\\') {
            str += source.slice(readPosition, currentPos)
            currentPos += 1
            switch (source[currentPos]) {
              case 't':
                str += '\t'
                break
              case 'n':
                str += '\n'
                break
              case '\\':
                str += '\\'
                break
              default:
                str += source[currentPos]
            }
            readPosition = currentPos + 1
          }
          currentPos += 1
        }
        if (source[currentPos] !== '"') {
          tokens.push({
            type: 'Error',
            value: '文字列の終わりがねえぞ',
          })
        } else {
          str += source.slice(readPosition, currentPos)
          readPosition = currentPos + 1
          tokens.push({
            type: 'String',
            value: str,
          })
        }
        break
      }
      case ' ':
      case '\t':
      case '\n':
        readPosition += 1
        break
      default:
        if (isDigit(source[readPosition])) {
          const digitsCount = countDigits(source.slice(readPosition))
          tokens.push({
            type: 'Int',
            value: parseInt(source.slice(readPosition, readPosition + digitsCount), 10),
          })
          readPosition += digitsCount
        } else if (isIdentChar(source[readPosition])) {
          const identCharsCount = countIdentChars(source.slice(readPosition))
          const name = source.slice(readPosition, readPosition + identCharsCount)
          switch (name) {
            case 'if':
              tokens.push({
                type: 'If',
              })
              break
            case 'def':
              tokens.push({
                type: 'Def',
              })
              break
            case 'true':
            case 'false':
              tokens.push({
                type: 'Bool',
                value: name === 'true',
              })
              break
            case 'null':
              tokens.push({
                type: 'Null',
              })
              break
            default:
              tokens.push({
                type: 'Ident',
                name,
              })
          }
          readPosition += identCharsCount
        } else {
          // 不明な文字
          tokens.push({
            type: 'UnknownCharacter',
            value: source[readPosition],
          })
          readPosition += 1
        }
    }
  }
  return tokens
}
