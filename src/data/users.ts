export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

const users: User[] = [
  {
    id: 'user1',
    name: 'Carlos Gonzalez',
    email: 'carlos.gonzalez@example.com',
    phone: '+52 55 1234 5678',
    createdAt: '2022-11-20',
  },
  {
    id: 'user2',
    name: 'Ana Rodriguez',
    email: 'ana.r@example.com',
    phone: '+52 55 8765 4321',
    createdAt: '2023-01-15',
  },
];

export default users;
