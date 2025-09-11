export const fetchWsToken = async () => {
  const response = await fetch("/api/get-ws-cookie");
  const data = await response.json();
  return data.ws_token;
};
