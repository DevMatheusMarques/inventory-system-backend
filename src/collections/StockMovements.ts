import { CollectionConfig } from 'payload'

const StockMovements: CollectionConfig = {
  slug: 'stock-movements',
  admin: { useAsTitle: 'id' },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
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
    { name: 'quantity', type: 'number', required: true },
    { name: 'date', type: 'date', required: true, defaultValue: new Date() },
    { name: 'unitCost', type: 'number', required: false },
    { name: 'note', type: 'textarea' },
  ],
  hooks: {
    afterChange: [
      async ({ req, doc }) => {
        const productId =
          typeof doc.product === 'object' && doc.product !== null
            ? (doc.product as any).value
            : doc.product

        if (!productId) return

        const product = (await req.payload.findByID({
          collection: 'products',
          id: productId,
        })) as unknown as { id: string; stock: number; costPrice?: number }

        if (!product) return

        const newStock =
          doc.type === 'in'
            ? (product.stock ?? 0) + doc.quantity
            : Math.max(0, (product.stock ?? 0) - doc.quantity)

        if (doc.type === 'in') {
          const totalAtual = (product.stock ?? 0) * (product.costPrice ?? 0)
          const totalNovo =
            doc.quantity * (doc.unitCost ?? product.costPrice ?? 0)

          const novoCusto =
            (totalAtual + totalNovo) / ((product.stock ?? 0) + doc.quantity)

          await req.payload.update({
            collection: 'products',
            id: product.id,
            data: { costPrice: Number(novoCusto.toFixed(2)) },
          })

          req.payload.logger.info(
            `💰 Custo médio atualizado para produto ${product.id}: R$${novoCusto.toFixed(2)}`
          )
        }

        await req.payload.update({
          collection: 'products',
          id: product.id,
          data: { stock: newStock },
        })

        await req.payload.create({
          collection: 'stock-logs',
          data: {
            product: product.id,
            movement: doc.id,
            user: req.user?.id || null,
            type: doc.type,
            quantity: doc.quantity,
            note: doc.note,
          },
        })

        await req.payload.create({
          collection: 'audit-trail',
          data: {
            user: req.user?.id || null,
            collection: 'stock-movements',
            documentId: doc.id,
            action: doc.type === 'in' ? 'Entrada de estoque' : 'Saída de estoque',
            data: doc,
          },
        })

        req.payload.logger.info(
          `✅ Estoque atualizado (${doc.type}) e log registrado para produto ${product.id}`,
        )
      },
    ],
    beforeChange: [
      async ({ req, data }) => {
        if (data.type === 'out') {
          const productId =
            typeof data.product === 'object' ? data.product.value : data.product

          const product = await req.payload.findByID({
            collection: 'products',
            id: productId,
          })

          if (product.stock < data.quantity) {
            throw new Error(
              `❌ Estoque insuficiente para ${product.name}. Atual: ${product.stock}, solicitado: ${data.quantity}`
            )
          }
        }

        return data
      },
      async ({ req, data, originalDoc }) => {
        if (!originalDoc) return data

        // Reverte movimentação antiga
        const productId =
          typeof originalDoc.product === 'object'
            ? originalDoc.product.value
            : originalDoc.product

        const product = await req.payload.findByID({
          collection: 'products',
          id: productId,
        })

        const estoqueRevertido =
          originalDoc.type === 'in'
            ? product.stock - originalDoc.quantity
            : product.stock + originalDoc.quantity

        await req.payload.update({
          collection: 'products',
          id: product.id,
          data: { stock: estoqueRevertido },
        })

        return data
      },
    ],
    afterDelete: [
      async ({ req, doc }) => {
        const productId =
          typeof doc.product === 'object' ? doc.product.value : doc.product

        const product = await req.payload.findByID({
          collection: 'products',
          id: productId,
        })

        const estoqueCorrigido =
          doc.type === 'in'
            ? product.stock - doc.quantity
            : product.stock + doc.quantity

        await req.payload.update({
          collection: 'products',
          id: product.id,
          data: { stock: estoqueCorrigido },
        })

        req.payload.logger.info(
          `♻️ Movimentação revertida para produto ${product.name}`
        )
      },
    ],
  },
}

export default StockMovements
