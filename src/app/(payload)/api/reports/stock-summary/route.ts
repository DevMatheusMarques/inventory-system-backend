import { getPayload } from 'payload'

export async function GET() {
  const payload = await getPayload({ config: require('@/payload.config').default })
  const products = await payload.find({ collection: 'products', limit: 999 })

  const summary = products.docs.map((p: any) => ({
    name: p.name,
    stock: p.stock,
    costPrice: p.costPrice,
    totalValue: p.stock * (p.costPrice ?? 0),
  }))

  const totalValue = summary.reduce((acc, p) => acc + p.totalValue, 0)

  return Response.json({ totalValue, summary })
}
