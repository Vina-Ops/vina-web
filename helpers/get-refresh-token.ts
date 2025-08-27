export const fetchRefreshToken = async () => {
  const response = await fetch("/api/get-refresh-cookie");
  const data = await response.json();

  return data.token;
};
