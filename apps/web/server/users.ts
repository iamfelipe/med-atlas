export const getUsers = async () => {
  const response = await fetch(`${process.env.API_URL}/user`);
  const users = await response.json();
  return users;
};
