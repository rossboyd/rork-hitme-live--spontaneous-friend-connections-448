// New hook to handle contact search logic
import { useMemo } from 'react';
import { Contact } from '@/types';

export const useContactSearch = (
  contacts: Contact[],
  searchQuery: string
) => {
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.phone.includes(query)
    );
  }, [contacts, searchQuery]);

  return filteredContacts;
};