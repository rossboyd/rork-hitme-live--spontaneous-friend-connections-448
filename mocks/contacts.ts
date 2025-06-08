import { Contact } from '@/types';

export const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    phone: '+1234567891',
    lastSeen: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    lastOnline: Date.now() - 1000 * 60 * 30, // 30 minutes ago
  },
  {
    id: 'contact-2',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    phone: '+1234567892',
    lastSeen: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    lastOnline: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
  },
  {
    id: 'contact-3',
    name: 'Jessica Williams',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    phone: '+1234567893',
    lastSeen: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    lastOnline: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
  },
  {
    id: 'contact-4',
    name: 'David Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    phone: '+1234567894',
    lastSeen: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    lastOnline: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
  },
  {
    id: 'contact-5',
    name: 'Emily Patel',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80',
    phone: '+1234567895',
    lastSeen: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    lastOnline: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
  },
  {
    id: 'contact-6',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=644&q=80',
    phone: '+1234567896',
    lastSeen: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
    lastOnline: null, // Never been online
  },
];