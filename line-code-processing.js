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
  const namedFunctionDeclarationRegex = /[a-zA-Z]+(\s*)\(.*\)(\s*){/
  const nonNamedFunctionDeclaration = /(function)(\s*)\(.*\)(\s*){/
  const namedFunctionExpressionRegex = /[a-zA-Z]+(\s*)=(\s*)(function)?(\s*)[a-zA-Z]*(\s*)\(.*\)(\s*)(=>)?(\s*){/
  const isNamedFunctionDeclaration    = namedFunctionDeclarationRegex.test(lineCode)
  const isNonNamedFunctionDeclaration = nonNamedFunctionDeclaration.test(lineCode)
  const isNamedFunctionExpression     = namedFunctionExpressionRegex.test(lineCode)
  return (isNamedFunctionDeclaration && !isNonNamedFunctionDeclaration) || isNamedFunctionExpression
}

/**
 *
 *
 */
function getTypeScriptFunctionRegexPattern() {
  // e.g. { @example `thisIsMyFunctionIsCoolTyper(superCoolVar: Array<Typo[]>, mittens: Classic[]): boolean {`         }                                       // Not sure if jsdoc plays well here.
  // Regex pattern chunks for TypeScript function headers to fix up VS Code extension.
  const regexFunctionNameWordFirstBounded = '([\w]{1,200}?)\b';  // Function name
  const regexParenthesisOpen              = '(\()';              // Open rounded bracket ( for parameters

  // Warning, doesn't check if real words or valid syntax, can having trailing characters, spaces etc.
  const regexVarsAndTypesDefined              = '([\w:,<>\t \[\]]{0,200})';  // Allow types in function header params such as <Array<typo[]>>
  const regexParameters                       = regexVarsAndTypesDefined;    // also allows the same syntax for types as parameters vars etc.
  const regexParenthesisClosed                = '(\))';                      // Closed rounded bracket ) for parameters.
  const regexReturnTypesDefinition            = regexVarsAndTypesDefined;    // also allows the same syntax for types as parameters vars etc.
  const regexOpeningCurlyBraceForFunctionBody = '({)'                        // the end of the important match to obtain function header.

  // Build the TypeScript function header :construction: regex pattern from the parts defined above.
  // e.g. { @example `thisIsMyFunctionIsCoolTyper(superCoolVar: Array<Typo[]>, mittens: Classic[]): boolean {`         }                                       // Not sure if jsdoc plays well here.
  const regexTSFullFunctionHeader = 
    regexFunctionNameWordFirstBounded +                                       // e.g. {@example `thisIsMyFunctionIsCoolTyper`                       }
    regexParenthesisOpen +                                                    // e.g. {@example `(`                                                 }
    regexParameters +                                                         // e.g. {@example `superCoolVar: Array<Typo[]>, mittens: Classic[]`   }
    regexParenthesisClosed +                                                  // e.g. {@example `)`                                                 }
    regexReturnTypesDefinition +                                              // e.g. {@example `: boolean`                                         }
    regexOpeningCurlyBraceForFunctionBody;                                    // e.g. {@example `{`                                                 }
  console.log(regexTSFullFunctionHeader);
  
  // Used string literals for patterns earlier instead of regex type `regex.+` instead of `/regex.+/`
  // So need to convert to regexp. Whoops. But need to escape more things...


  return regexTSFullFunctionHeader;
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
