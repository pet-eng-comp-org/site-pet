import jsonWebTokenService from "jsonwebtoken";

function isAuth() {
  const token = localStorage.getItem("LOGINPET_TOKEN");
  if (token != null) {
    return jsonWebTokenService.decode(token);
  }
  return null;
}

export default isAuth;
