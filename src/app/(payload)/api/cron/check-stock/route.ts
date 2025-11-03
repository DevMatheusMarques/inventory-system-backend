import payload from 'payload'

export const dynamic = 'force-dynamic' // garante execução a cada chamada

export async function GET() {
  const products = await payload.find({ collection: 'products', limit: 999 })
  const lowStock = products.docs.filter((p: any) => p.stock < p.minStock)

  if (lowStock.length === 0) {
    payload.logger.info('✅ Nenhum produto abaixo do mínimo.')
    return new Response('Sem produtos com estoque baixo.')
  }

  for (const p of lowStock) {
    await payload.create({
      collection: 'notifications',
      data: {
        message: `Produto ${p.name} com estoque baixo (${p.stock}/${p.minStock})`,
        type: 'warning',
      },
    })
  }

  payload.logger.warn(`⚠️ ${lowStock.length} produtos abaixo do mínimo.`)
  return new Response(`${lowStock.length} produtos abaixo do mínimo.`)
}
