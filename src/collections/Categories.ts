import { CollectionConfig } from 'payload';

const Categories: CollectionConfig = {
  slug: 'categories',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea'},
  ],
  access: {
    create: ({ req }) => ['admin', 'manager', 'employee'].includes(req.user?.role ?? ''),
    delete: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => ['admin', 'manager', 'employee'].includes(req.user?.role ?? ''),
    read: () => true,
  },
};

export default Categories;
