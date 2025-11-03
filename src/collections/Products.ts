import { CollectionConfig } from 'payload';

const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    { name: 'supplier', type: 'relationship', relationTo: 'suppliers', required: true },
    { name: 'stock', type: 'number', defaultValue: 0, required: true },
    { name: 'minStock', type: 'number', defaultValue: 5, required: true },
    { name: 'maxStock', type: 'number', defaultValue: 100, required: true },
    { name: 'costPrice', type: 'number', required: false },
    { name: 'salePrice', type: 'number', required: false },
  ],
  access: {
    create: ({ req }) => ['admin', 'manager', 'employee'].includes(req.user?.role ?? ''),
    delete: async ({ req, id }) => {
      const movements = await req.payload.find({
        collection: 'stock-movements',
        where: { product: { equals: id } },
        limit: 1,
      })
      return movements.totalDocs === 0 && req.user?.role === 'admin'
    },
    update: ({ req }) => ['admin', 'manager', 'employee'].includes(req.user?.role ?? ''),
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ req, doc, operation }) => {
        await req.payload.create({
          collection: 'audit-trail',
          data: {
            user: req.user?.id || null,
            collection: 'products',
            documentId: doc.id,
            action: operation === 'update' ? 'Atualização' : 'Criação',
            data: doc,
          },
        })
      },
      async ({ req, doc }) => {
        if (doc.stock < doc.minStock) {
          req.payload.logger.warn(
            `⚠️ Produto ${doc.name} abaixo do estoque mínimo! Atual: ${doc.stock}, Mínimo: ${doc.minStock}`
          )

          await req.payload.create({
            collection: 'notifications',
            data: {
              message: `Produto ${doc.name} está com estoque baixo (${doc.stock})`,
              type: 'warning',
            },
          })
        }
      },
    ],
    afterDelete: [
      async ({ req, id }) => {
        await req.payload.create({
          collection: 'audit-trail',
          data: {
            user: req.user?.id || null,
            collection: 'products',
            documentId: String(id),
            action: 'Exclusão',
          },
        })
      },
    ],
  },
};

export default Products;
