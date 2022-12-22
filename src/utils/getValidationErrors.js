export default function getValidationErrors(err) {
  const validationErrors = {};

  err.inner.forEach((error) => {
    validationErrors[error.path || 0] = error.message;
  });

  return validationErrors;
}
