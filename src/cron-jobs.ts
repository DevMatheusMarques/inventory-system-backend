// src/cron-jobs.ts
import cron from 'node-cron'
import payload from 'payload'

// 🕗 Agendador: roda todos os dias às 8h
cron.schedule('0 8 * * *', async () => {
  const produtos = await payload.find({
    collection: 'products',
    limit: 999,
  })

  const baixoEstoque = produtos.docs.filter(
    (p: any) => p.stock < p.minStock,
  )

  if (baixoEstoque.length === 0) {
    payload.logger.info('✅ Todos os estoques estão dentro do limite.')
    return
  }

  baixoEstoque.forEach((p: any) => {
    payload.logger.warn(
      `⚠️ Produto abaixo do mínimo: ${p.name} (Atual: ${p.stock} / Mínimo: ${p.minStock})`,
    )
  })
})
