import { Contact, Mode } from '@/types';

export const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    phone: '+44123456789',
    lastSeen: Date.now() - 1000 * 60 * 15, // 15 minutes ago
    lastOnline: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    modes: ['work', 'social']
  },
  {
    id: 'contact-2',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    phone: '+44234567890',
    lastSeen: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    lastOnline: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    modes: ['work']
  },
  {
    id: 'contact-3',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    phone: '+44345678901',
    lastSeen: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    modes: ['family', 'social']
  },
  {
    id: 'contact-4',
    name: 'James Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    phone: '+44456789012',
    lastSeen: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    lastOnline: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    modes: ['social']
  },
  {
    id: 'contact-5',
    name: 'Olivia Taylor',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=633&q=80',
    phone: '+44567890123',
    lastSeen: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    modes: ['work', 'family']
  },
  {
    id: 'contact-6',
    name: 'Daniel Brown',
    avatar: null, // Will show initials
    phone: '+44678901234',
    lastSeen: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    modes: ['family']
  },
  {
    id: 'contact-7',
    name: 'Sophia Martinez',
    avatar: null, // Will show initials
    phone: '+44789012345',
    lastSeen: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    lastOnline: Date.now() - 1000 * 60 * 60 * 24 * 4, // 4 days ago
    modes: ['work', 'social']
  },
];