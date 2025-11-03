// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import Categories from './collections/Categories'
import Suppliers from './collections/Suppliers'
import Products from './collections/Products'
import StockMovements from './collections/StockMovements'
import Users from './collections/Users'
import StockLogs from '@/collections/StockLogs'
import Notifications from '@/collections/Notifications'
import PurchaseOrders from '@/collections/PurchaseOrders'
import AuditTrail from '@/collections/AuditTrail'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Categories,
    Suppliers,
    Products,
    StockMovements,
    StockLogs,
    Notifications,
    PurchaseOrders,
    AuditTrail
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
