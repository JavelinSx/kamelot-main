import contactsData from "~/public/data/contacts.json";

export interface ContactsData {
  academy: {
    name: string;
    address: string;
    phone: string;
    workingHours: {
      weekdays: string;
      weekend: string;
    };
    description: string;
    socialLinks: {
      vk: string;
      telegram: string;
    };
  };
}

export const useContacts = () => {
  // Импортируем данные напрямую из JSON - они будут встроены в билд
  const contacts = ref<ContactsData>(contactsData as ContactsData);

  return {
    contacts: readonly(contacts),
  };
};
