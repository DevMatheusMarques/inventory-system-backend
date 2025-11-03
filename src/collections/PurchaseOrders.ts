import { CollectionConfig } from 'payload'

const PurchaseOrders: CollectionConfig = {
  slug: 'purchase-orders',
  admin: { useAsTitle: 'id' },
  fields: [
    {
      name: 'supplier',
      type: 'relationship',
      relationTo: 'suppliers',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pendente', value: 'pending' },
        { label: 'Recebido', value: 'received' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        { name: 'quantity', type: 'number', required: true },
        { name: 'unitPrice', type: 'number', required: true },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ req, doc }) => {
        if (doc.status === 'received') {
          for (const item of doc.items) {
            await req.payload.create({
              collection: 'stock-movements',
              data: {
                product: item.product,
                quantity: item.quantity,
                type: 'in',
                note: `Compra via pedido #${doc.id}`,
              },
            } as never)
          }
        }
      },
    ],
  },
}

export default PurchaseOrders
