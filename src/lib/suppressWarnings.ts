// Utility to suppress specific React warnings
export const suppressDefaultPropsWarning = () => {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Suppress the specific defaultProps warning from react-beautiful-dnd
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      args[0].includes('Support for defaultProps will be removed from memo components')
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  // Return a function to restore the original console.error
  return () => {
    console.error = originalError;
  };
}; 