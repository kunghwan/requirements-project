export const emailValidator = (email: string): boolean => {
  if (email.length === 0) {
    return false;
  }
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

  return regex.test(email);
};
