export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number; // sale price
  cost: number; // supplier cost per unit
  stock: number; // units available
  supplier: string;
  sold?: number; // units sold (for realized profit)
  image?: string; // product image URL
  rating?: number; // 0-5 stars
};

const products: Product[] = [
  {
    id: 'P001',
    name: 'Collar reflectante',
    description: 'Collar para perros con reflejante nocturno. Seguridad y estilo en cada paseo.',
    price: 12.99,
    cost: 6.5,
    stock: 24,
    supplier: 'PetSupplies S.A.',
    sold: 30,
    image: 'https://images.unsplash.com/photo-1587300411107-ec4b77d2b5e5?w=400&h=400&fit=crop',
    rating: 4.5,
  },
  {
    id: 'P002',
    name: 'Cama ortopédica mediana',
    description: 'Cama con espuma viscoelástica para mascotas. Confort total para tu mascota.',
    price: 49.9,
    cost: 28.0,
    stock: 12,
    supplier: 'HomePets Ltda.',
    sold: 8,
    image: 'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=400&h=400&fit=crop',
    rating: 4.8,
  },
  {
    id: 'P003',
    name: 'Snack dental (pack 10)',
    description: 'Snack para higiene dental. Frescos y saludables para tu perro.',
    price: 8.5,
    cost: 3.2,
    stock: 100,
    supplier: 'NaturTreats',
    sold: 200,
    image: 'https://images.unsplash.com/photo-1555244124-75c0269b08e0?w=400&h=400&fit=crop',
    rating: 4.6,
  },
  {
    id: 'P004',
    name: 'Juguete pelota resistente',
    description: 'Pelota de caucho resistente para juegos. Diversión garantizada.',
    price: 7.25,
    cost: 2.8,
    stock: 0,
    supplier: 'FunPet Imports',
    sold: 15,
    image: 'https://images.unsplash.com/photo-1552053831-71594a27c62d?w=400&h=400&fit=crop',
    rating: 4.3,
  },
];

export default products;
