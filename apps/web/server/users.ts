export const getUsers = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);
  const users = await response.json();
  return users;
};
