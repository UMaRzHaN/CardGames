export function ValidationPass(text) {
  var validate = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,}/;
  if (validate.test(text)) {
    return true;
  } else {
    return false;
  }
}

export const validate_Email = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
