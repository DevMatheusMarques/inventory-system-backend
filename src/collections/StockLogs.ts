import { CollectionConfig } from 'payload'

const StockLogs: CollectionConfig = {
  slug: 'stock-logs',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['product', 'user', 'type', 'quantity', 'createdAt'],
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'movement',
      type: 'relationship',
      relationTo: 'stock-movements',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Entrada', value: 'in' },
        { label: 'Saída', value: 'out' },
      ],
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
    },
    {
      name: 'note',
      type: 'textarea',
    },
  ],
}

export default StockLogs
