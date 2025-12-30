export function getCallerFunctionName(): string | undefined {
  const stack = new Error().stack;
  if (!stack) return;

  const lines = stack.split('\n');

  const callerLine = lines[3];

  // Match: at ClassName.methodName
  const match = callerLine.match(/at (?:(?:\w+\.)?(\w+)) \(/);

  return match ? match[1] : undefined;
}
