// Comprehensive expression cleaner (shared utility)
function cleanExpression(expr) {
  let cleaned = expr;
  
  // Step 1: Keep only valid math characters and convert x to * for arithmetic
  cleaned = cleaned
    .replace(/[^0-9+\-*/().x]/gi, "");
  
  // Step 2: Clean leading and trailing operators
  cleaned = cleaned.replace(/^[+\-*/.]+/, "");
  cleaned = cleaned.replace(/[+\-*/.]+$/, "");
  
  // Step 3: Fix double/multiple consecutive operators (keep the last one)
  cleaned = cleaned.replace(/[+\-*/]{2,}/g, (match) => match.slice(-1));
  
  // Step 4: Remove empty parentheses or parentheses with only operators inside
  cleaned = cleaned.replace(/\([+\-*/]?\)/g, "");
  
  // Step 5: Fix patterns like *(*2) → *2, +(+3) → +3, etc.
  cleaned = cleaned.replace(/\*\(\*?(\d+)\)/g, "*$1");
  cleaned = cleaned.replace(/\+\(\+?(\d+)\)/g, "+$1");
  cleaned = cleaned.replace(/-\(-?(\d+)\)/g, "-$1");
  cleaned = cleaned.replace(/\/\/\(?(\d+)\)/g, "/$1");
  
  // Step 6: Remove orphaned operators from Step 4
  cleaned = cleaned.replace(/[+\-*/.]+$/, "");
  cleaned = cleaned.replace(/^[+\-*/.]+/, "");
  
  return cleaned;
}

function solve(problem) {
  let cleaned = problem.toLowerCase().replace(/\s/g, "");
  
  // Apply comprehensive cleaning
  cleaned = cleanExpression(cleaned);
  
  // Check for quadratic (x^2)
  if (cleaned.includes("x^2") || cleaned.includes("x*x")) {
    return solveQuadratic(cleaned, problem);
  }
  
  // Check for linear equations with x
  if (cleaned.includes("x")) {
    return solveLinear(cleaned, problem);
  }
  
  // Try arithmetic evaluation for expressions without variables
  if (/^[0-9+\-*/().]+$/.test(cleaned)) {
    return solveArithmetic(cleaned, problem);
  }
  
  return {
    steps: [`Extracted: ${problem}`],
    finalAnswer: "Expression detected"
  };
}

function solveLinear(equation, original) {
  const patterns = [
    // x followed by operator and number, equals number: x+5=10, x-3=7
    /x([+-]?\d+)=(-?\d+)/,
    // number + x = number: 5+x=10, 3+x=8
    /(-?\d+)\+x=(-?\d+)/,
    // number - x = number: 10-x=5, 8-x=3  
    /(-?\d+)-x=(-?\d+)/,
    // number * x = number: 2*x=10, 3x=15 (with implicit multiplication)
    /(-?\d+)\*?x=(-?\d+)/,
    // x * number = number: x*2=10
    /x\*(-?\d+)=(-?\d+)/,
    // x = number (already solved)
    /x=(-?\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = equation.match(pattern);
    if (match) {
      // x = number (already solved)
      if (pattern.source.includes("x=(-?\\d+)") && !pattern.source.includes("\*")) {
        const result = parseInt(match[1]);
        return {
          steps: [
            `Step 1: Original equation: x = ${result}`,
            "Step 2: Solution is already isolated",
            `Step 3: x = ${result}`
          ],
          finalAnswer: `x = ${result}`
        };
      }
      
      // number + x = number
      if (pattern.source.includes("(-?\\d+)\\+x")) {
        const leftConst = parseInt(match[1]);
        const rightSide = parseInt(match[2]);
        const result = rightSide - leftConst;
        return {
          steps: [
            `Step 1: Original equation: ${leftConst} + x = ${rightSide}`,
            `Step 2: Subtract ${leftConst} from both sides`,
            `Step 3: x = ${rightSide} - ${leftConst}`,
            `Step 4: x = ${result}`
          ],
          finalAnswer: `x = ${result}`
        };
      }
      
      // number - x = number
      if (pattern.source.includes("(-?\\d+)-x")) {
        const leftConst = parseInt(match[1]);
        const rightSide = parseInt(match[2]);
        const result = leftConst - rightSide;
        return {
          steps: [
            `Step 1: Original equation: ${leftConst} - x = ${rightSide}`,
            `Step 2: Subtract ${leftConst} from both sides`,
            `Step 3: -x = ${rightSide} - ${leftConst} = ${rightSide - leftConst}`,
            `Step 4: x = ${result}`
          ],
          finalAnswer: `x = ${result}`
        };
      }
      
      // number * x = number (including implicit 2x, 3x)
      if (pattern.source.includes("(-?\\d+)\\*?x") && !pattern.source.includes("\\+")) {
        const coefficient = parseInt(match[1]);
        const rightSide = parseInt(match[2]);
        const result = rightSide / coefficient;
        if (Number.isInteger(result)) {
          return {
            steps: [
              `Step 1: Original equation: ${coefficient}x = ${rightSide}`,
              `Step 2: Divide both sides by ${coefficient}`,
              `Step 3: x = ${rightSide} / ${coefficient}`,
              `Step 4: x = ${result}`
            ],
            finalAnswer: `x = ${result}`
          };
        }
      }
      
      // x * number = number
      if (pattern.source.includes("x\\*(-?\\d+)")) {
        const coefficient = parseInt(match[1]);
        const rightSide = parseInt(match[2]);
        const result = rightSide / coefficient;
        if (Number.isInteger(result)) {
          return {
            steps: [
              `Step 1: Original equation: x * ${coefficient} = ${rightSide}`,
              `Step 2: Divide both sides by ${coefficient}`,
              `Step 3: x = ${rightSide} / ${coefficient}`,
              `Step 4: x = ${result}`
            ],
            finalAnswer: `x = ${result}`
          };
        }
      }
      
      // x followed by operator and number = number (default case)
      const leftValue = parseInt(match[1]);
      const rightSide = parseInt(match[2]);
      const result = rightSide - leftValue;
      
      return {
        steps: [
          `Step 1: Original equation: x${leftValue >= 0 ? "+" : ""}${leftValue} = ${rightSide}`,
          `Step 2: Subtract ${leftValue} from both sides`,
          `Step 3: x = ${rightSide} - ${leftValue}`,
          `Step 4: x = ${result}`
        ],
        finalAnswer: `x = ${result}`
      };
    }
  }
  
  return {
    steps: [`Extracted problem but unable to fully solve: ${original}`],
    finalAnswer: "Could not determine"
  };
}

function solveQuadratic(equation, original) {
  const patterns = [
    /x\^2([+-]?\d*)x?=(-?\d*)/,
    /x\^2=(-?\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = equation.match(pattern);
    if (match) {
      if (pattern.source.includes("x\^2=(-?\d+)")) {
        const c = -parseInt(match[1]);
        if (c === 0) {
          return {
            steps: [
              "Step 1: Original equation: x^2 = 0",
              "Step 2: Take square root of both sides",
              "Step 3: x = 0"
            ],
            finalAnswer: `x = 0`
          };
        }
        const sqrtVal = Math.sqrt(Math.abs(c));
        return {
          steps: [
            `Step 1: Original equation: x^2 = ${-c}`,
            "Step 2: Take square root of both sides",
            `Step 3: x = ±${sqrtVal.toFixed(2).replace(/\.00$/, "")}`
          ],
          finalAnswer: `x = ±${sqrtVal.toFixed(2).replace(/\.00$/, "")}`
        };
      }
      
      const b = match[1] ? parseInt(match[1]) : 0;
      const c = match[2] ? parseInt(match[2]) : 0;
      
      if (c === 0) {
        return {
          steps: [
            `Step 1: Original equation: x^2${b >= 0 ? "+" : ""}${b}x = 0`,
            `Step 2: Factorize: x(x${b >= 0 ? "+" : ""}${b}) = 0`,
            `Step 3: x = 0 or x${b >= 0 ? "+" : ""}${b} = 0`,
            `Step 4: Solutions: x = 0 and x = ${-b}`
          ],
          finalAnswer: `x = 0, ${-b}`
        };
      }
      
      return {
        steps: [
          `Step 1: Original equation: x^2${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c} = 0`,
          "Step 2: Use quadratic formula",
          "Step 3: Solutions depend on discriminant"
        ],
        finalAnswer: "Requires quadratic formula"
      };
    }
  }
  
  return {
    steps: [`Extracted problem but unable to fully solve: ${original}`],
    finalAnswer: "Could not determine"
  };
}

function solveArithmetic(expression, original) {
  try {
    // Apply comprehensive cleaning
    let sanitized = cleanExpression(expression);
    
    // Additional arithmetic-specific cleaning
    sanitized = sanitized.replace(/[^0-9+\-*/().]/g, "");
    
    if (!sanitized) {
      return {
        steps: [`Invalid expression: ${original}`],
        finalAnswer: "Error"
      };
    }
    
    // Use Function constructor for safe evaluation
    const result = new Function("return " + sanitized)();
    
    return {
      steps: [
        `Step 1: Expression: ${original}`,
        `Step 2: Calculate: ${sanitized}`,
        `Step 3: Result = ${result}`
      ],
      finalAnswer: `${result}`
    };
  } catch (err) {
    return {
      steps: [`Could not evaluate: ${original}`],
      finalAnswer: "Calculation error"
    };
  }
}

module.exports = { solve };
