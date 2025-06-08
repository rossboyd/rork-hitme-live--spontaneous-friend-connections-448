import { useAppStore as useStore } from '@/store/useAppStore';
import { Contact, HitRequest } from '@/types';

export const useAppStore = () => {
  const store = useStore();
  
  // Expose only what's needed from the store
  return {
    // Contacts
    contacts: store.contacts,
    addContact: store.addContact,
    updateContact: store.updateContact,
    deleteContact: store.deleteContact,
    
    // Requests
    inboundRequests: store.inboundRequests,
    outboundRequests: store.outboundRequests,
    addRequest: store.addRequest,
    updateRequest: store.updateRequest,
    deleteRequest: store.deleteRequest,
    updateRequestStatus: store.updateRequestStatus,
    expireRequests: store.expireRequests,
    deleteOutboundRequest: store.deleteOutboundRequest,
    updateOutboundRequest: store.updateOutboundRequest,
    
    // Live Mode
    isLiveMode: store.isLiveMode,
    toggleLiveMode: store.toggleLiveMode,
    
    // Hit List
    hitList: store.hitList,
    addToHitList: store.addToHitList,
    removeFromHitList: store.removeFromHitList,
    isInHitList: (contactId: string) => store.hitList.includes(contactId),
  };
};