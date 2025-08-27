export const removeToken = async () => {
  const response = await fetch("/api/remove-cookie");
  const data = await response.json();
  return data.message;
};
