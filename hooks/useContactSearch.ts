import { useMemo } from 'react';
import { Contact, Mode, SortOrder } from '@/types';
import { useAppStore } from '@/store/useAppStore';

export const useContactSearch = (
  contacts: Contact[],
  searchQuery: string,
  modeFilter: Mode | null = null,
  sortOrder: SortOrder = 'alphabetical'
) => {
  const { modeRankings } = useAppStore();

  const filteredAndSortedContacts = useMemo(() => {
    let result = [...contacts];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(contact => 
        contact.name.toLowerCase().includes(query) ||
        contact.phone.includes(query)
      );
    }
    
    // Apply mode filter
    if (modeFilter) {
      result = result.filter(contact => 
        contact.modes?.includes(modeFilter)
      );
    }
    
    // Apply sorting
    if (sortOrder === 'alphabetical') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'ranked' && modeFilter) {
      // Sort by custom ranking for the selected mode
      const modeRanking = modeRankings[modeFilter] || {};
      
      result.sort((a, b) => {
        const rankA = modeRanking[a.id];
        const rankB = modeRanking[b.id];
        
        // If both have rankings, sort by rank
        if (rankA !== undefined && rankB !== undefined) {
          return rankA - rankB;
        }
        
        // If only one has a ranking, prioritize the ranked one
        if (rankA !== undefined && rankB === undefined) {
          return -1;
        }
        if (rankA === undefined && rankB !== undefined) {
          return 1;
        }
        
        // If neither has a ranking, sort alphabetically
        return a.name.localeCompare(b.name);
      });
    } else {
      // Default to alphabetical if ranked is selected but no mode filter
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return result;
  }, [contacts, searchQuery, modeFilter, sortOrder, modeRankings]);

  return filteredAndSortedContacts;
};