export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
}

// You can add mock data here if needed for initial development
// const mockSuppliers: Supplier[] = [
//   {
//     id: 'SUP001',
//     name: 'PetSupplies S.A.',
//     contact_person: 'Juan Perez',
//     phone: '555-1234',
//     email: 'juan.perez@petsupplies.com',
//     address: 'Av. Siempre Viva 123',
//   },
//   {
//     id: 'SUP002',
//     name: 'HomePets Ltda.',
//     contact_person: 'Maria Garcia',
//     phone: '555-5678',
//     email: 'maria.garcia@homepets.com',
//     address: 'Calle Falsa 456',
//   },
// ];

// export default mockSuppliers;

// Export an empty object to ensure the file is treated as a module
export {};
