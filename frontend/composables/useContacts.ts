export interface ContactsData {
  academy: {
    name: string
    address: string
    phone: string
    email: string
    workingHours: {
      weekdays: string
      weekend: string
    }
    description: string
    socialLinks: {
      vk: string
      telegram: string
      instagram: string
      youtube: string
    }
  }
}

export const useContacts = () => {
  const contacts = useState<ContactsData | null>('contacts', () => null)
  const loading = useState<boolean>('contacts-loading', () => false)
  const error = useState<Error | null>('contacts-error', () => null)

  const fetchContacts = async () => {
    if (contacts.value) return contacts.value

    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const baseUrl = config.public.storageUrl || ''
      const url = baseUrl ? `${baseUrl}/data/contacts.json` : '/data/contacts.json'

      const response = await $fetch<ContactsData>(url)
      contacts.value = response
      return response
    } catch (err) {
      error.value = err as Error
      console.error('Error fetching contacts:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    contacts: readonly(contacts),
    loading: readonly(loading),
    error: readonly(error),
    fetchContacts
  }
}
