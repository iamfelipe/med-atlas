import { getUsers } from "@/server/users";

export default async function Dashboard() {
  const users = await getUsers();

  return (
    <>
      <h1>General dashboard</h1>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <p>
              {user.firstName} {user.lastName}
            </p>
            <p>{user.role}</p>
            <span>{user.email}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
