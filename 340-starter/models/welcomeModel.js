// Example model for debugging exercise
function getWelcomeMessage() {
  // Intentional bug: typo in variable name
  const message = 'Welcome to CSE 340!';
  return message; // <-- fixed typo
}

module.exports = { getWelcomeMessage };