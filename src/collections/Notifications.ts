import { CollectionConfig } from 'payload'

const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: { useAsTitle: 'message' },
  fields: [
    { name: 'message', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Aviso', value: 'warning' },
        { label: 'Erro', value: 'error' },
        { label: 'Info', value: 'info' },
      ],
      defaultValue: 'info',
    },
    { name: 'read', type: 'checkbox', defaultValue: false },
  ],
}

export default Notifications
