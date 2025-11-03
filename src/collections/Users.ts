import { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email'
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Gerente', value: 'manager' },
        { label: 'Funcionário', value: 'employee' },
      ],
      defaultValue: 'employee',
    },
  ],
  access: {
    create: ({ req }) => ['admin', 'manager'].includes(req.user?.role ?? ''),
    delete: ({ req }) => ['admin', 'manager'].includes(req.user?.role ?? ''),
    update: ({ req }) => ['admin', 'manager'].includes(req.user?.role ?? ''),
    read: () => true,
  },
};

export default Users;
