export const fetchToken = async () => {
  const response = await fetch("/api/get-cookie");
  const data = await response.json();
  return data.token;
};
