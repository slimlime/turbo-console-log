/**
 * Return a boolean indicating if the line code represents a class declaration or not
 * @function
 * @param {string} lineCode
 * @author Chakroun Anas <chakroun.anas@outlook.com>
 * @returns {boolean}
 * @since 1.0
 */
function checkClassDeclaration(lineCode) {
  const classNameRegex = /class(\s+)[a-zA-Z]+(.*){/
  return classNameRegex.test(lineCode)
}

/**
 * Return the class name in case if the line code represents a class declaration
 * @function
 * @param {string} lineCode
 * @author Chakroun Anas <chakroun.anas@outlook.com>
 * @returns {string}
 * @since 1.0
 */
function className(lineCode) {
  if (lineCode.split(/class /).length >= 2) {
    const textInTheRightOfClassKeyword = lineCode.split(/class /)[1].trim()
    if (textInTheRightOfClassKeyword.split(' ').length > 0) {
      return textInTheRightOfClassKeyword.split(' ')[0].replace('{', '')
    } else {
      return textInTheRightOfClassKeyword.replace('{', '')
    }
  }
  return ''
}

/**
 * Return a boolean indicating if the line code represents a named function declaration
 * @function
 * @param {string} lineCode
 * @returns {boolean}
 * @author Chakroun Anas <chakroun.anas@outlook.com>
 * @since 1.0
 */
function checkIfNamedFunction(lineCode) {

  // const namedFunctionDeclarationRegex = /[a-zA-Z]+(\s*)\(.*\)(\s*){/         // - FIXME: Replaced with typescript function regex bug #1: TypeScript
  const namedFunctionDeclarationRegex = getTypeScriptFunctionRegexPattern();  // - FIXED 
  const nonNamedFunctionDeclaration   = /(function)(\s*)\(.*\)(\s*){/
  const namedFunctionExpressionRegex = /[a-zA-Z]+(\s*)=(\s*)(function)?(\s*)[a-zA-Z]*(\s*)\(.*\)(\s*)(=>)?(\s*){/
  const isNamedFunctionDeclaration    = namedFunctionDeclarationRegex.test(lineCode)
  const isNonNamedFunctionDeclaration = nonNamedFunctionDeclaration.test(lineCode)
  const isNamedFunctionExpression     = namedFunctionExpressionRegex.test(lineCode)
  return (isNamedFunctionDeclaration && !isNonNamedFunctionDeclaration) || isNamedFunctionExpression
}

/**
 * Returns TypeScript function header Regex
 * @function
 * 
 * @returns {RegExp} The constructed regex pattern for TypeScript function headers
 * @author Samuel Lim
 * @since 1.1.1
 */
function getTypeScriptFunctionRegexPattern() {
  // - TODO: Add TypeScript function header tests to the turbo-console-log to avoid this issue in the future and provide CI testing.

  // e.g. { @example `thisIsMyFunctionIsCoolTyper(superCoolVar: Array<Typo[]>, mittens: Classic[]): boolean {`         }                                       // Not sure if jsdoc plays well here.
  // Regex pattern chunks for TypeScript function headers to fix up VS Code extension.
  const regexFunctionNameWordFirstBounded = '([\\w]{1,200}?)\\b';  // Function name
  const regexParenthesisOpen              = '(\\()';               // Open rounded bracket ( for parameters

  // Warning, doesn't check if real words or valid syntax, can having trailing characters, spaces etc.
  const regexVarsAndTypesDefined              = '([\\w:,<>\\t \\[\\]]{0,200})';  // Allow types in function header params such as <Array<typo[]>>
  const regexParameters                       = regexVarsAndTypesDefined;        // Also allows the same syntax for types as parameters vars etc.
  const regexParenthesisClosed                = '(\\))';                         // Closed rounded bracket ) for parameters.
  const regexReturnTypesDefinition            = regexVarsAndTypesDefined;        // Also allows the same syntax for types as parameters vars etc.
  const regexOpeningCurlyBraceForFunctionBody = '({)'                            // The end of the important match to obtain function header.

  // Build the TypeScript function header :construction: regex pattern from the parts defined above.
  // e.g. { @example `thisIsMyFunctionIsCoolTyper(superCoolVar: Array<Typo[]>, mittens: Classic[]): boolean {`         }                                       // Not sure if jsdoc plays well here.
  const regexTSFullFunctionHeader = 
    regexFunctionNameWordFirstBounded +                                       // e.g. {@example `thisIsMyFunctionIsCoolTyper`                       }
    regexParenthesisOpen +                                                    // e.g. {@example `(`                                                 }
    regexParameters +                                                         // e.g. {@example `superCoolVar: Array<Typo[]>, mittens: Classic[]`   }
    regexParenthesisClosed +                                                  // e.g. {@example `)`                                                 }
    regexReturnTypesDefinition +                                              // e.g. {@example `: boolean`                                         }
    regexOpeningCurlyBraceForFunctionBody;                                    // e.g. {@example `{`                                                 }

  // Used string literals for patterns earlier instead of regex type `regex.+` instead of `/regex.+/`
  // So need to convert to regexp. Whoops. But need to escape more things...
  // Doubled the backslash on all the symbols in the debunked regex vars above so that \\w becomes \w.
  const regexTSFullFunctionHeaderRegexedFromEscapedStringPatterns = new RegExp(regexTSFullFunctionHeader);


  return regexTSFullFunctionHeaderRegexedFromEscapedStringPatterns;
}
/**
 * Return a boolean indicating if the line code represents an if, switch, while or for statement
 * @function
 * @param {string} lineCode
 * @returns {boolean}
 * @author Chakroun Anas <chakroun.anas@outlook.com>
 * @since 1.0
 */
function checkIfJSBuiltInStatement(lineCode) {
  const jSBuiltInStatement = /(if|switch|while|for)(\s*)\(.*\)(\s*){/
  return jSBuiltInStatement.test(lineCode)
}

/**
 * Return the function name in case if the line code represents a named function declaration
 * @function
 * @param {string} lineCode
 * @returns {string} The name of the function that the line code represents
 * @author Chakroun Anas <chakroun.anas@outlook.com>
 * @since 1.0
 */
function functionName(lineCode) {
  if (/function(\s+)[a-zA-Z]+(\s*)\(.*\)(\s*){/.test(lineCode)) {
    if (lineCode.split('function ').length > 1) {
      return lineCode.split('function ')[1].split('(')[0].replace(/(\s*)/g, '')
    }
  } else {
    if (lineCode.split(/\(.*\)/).length > 0) {
      const textInTheLeftOfTheParams = lineCode.split(/\(.*\)/)[0]
      if (/=/.test(textInTheLeftOfTheParams)) {
        if (textInTheLeftOfTheParams.split('=').length > 0) {
          return textInTheLeftOfTheParams.split('=')[0].replace(/const |var |let |=|(\s*)/g, '')
        }
      } else {
        return textInTheLeftOfTheParams.replace(/(\s*)/g, '')
      }
    }
  }
  return ''
}

module.exports.checkClassDeclaration     = checkClassDeclaration
module.exports.className                 = className
module.exports.checkIfNamedFunction      = checkIfNamedFunction
module.exports.checkIfJSBuiltInStatement = checkIfJSBuiltInStatement
module.exports.functionName              = functionName
