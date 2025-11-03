import { CollectionConfig } from 'payload';
import axios from 'axios'

const Suppliers: CollectionConfig = {
  slug: 'suppliers',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'cnpj', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'cep', type: 'text', required: true, },
    { name: 'address', type: 'text', required: true, },
    { name: 'number', type: 'text', required: false, },
    { name: 'complement', type: 'text', required: false, },
    { name: 'neighborhood', type: 'text', required: false, },
    { name: 'city', type: 'text', required: false, },
    { name: 'state', type: 'text', required: false, }
  ],
  access: {
    create: ({ req }) => ['admin', 'manager', 'employee'].includes(req.user?.role ?? ''),
    delete: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => ['admin', 'manager', 'employee'].includes(req.user?.role ?? ''),
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data.cnpj) {
          const res = await axios.get(`https://receitaws.com.br/v1/cnpj/${data.cnpj}`)
          data.name = res.data.nome
          data.address = res.data.logradouro
          data.city = res.data.municipio
          data.state = res.data.uf
        }
        return data
      },
    ],
  },
};

export default Suppliers;
