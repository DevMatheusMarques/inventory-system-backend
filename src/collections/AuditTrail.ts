import { CollectionConfig } from 'payload'

const AuditTrail: CollectionConfig = {
  slug: 'audit-trail',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['user', 'action', 'collection', 'createdAt'],
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: false },
    { name: 'collection', type: 'text', required: true },
    { name: 'documentId', type: 'text', required: true },
    { name: 'action', type: 'text', required: true },
    { name: 'data', type: 'json' },
  ],
}

export default AuditTrail
