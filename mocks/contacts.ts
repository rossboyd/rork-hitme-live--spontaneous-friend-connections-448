import { Contact } from '@/types';

export const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    name: 'Emma Johnson',
    phone: '+1 (555) 123-4567',
    email: 'emma.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    lastOnline: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    isOnline: false,
  },
  {
    id: 'contact-2',
    name: 'James Smith',
    phone: '+1 (555) 234-5678',
    email: 'james.smith@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    lastOnline: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isOnline: false,
  },
  {
    id: 'contact-3',
    name: 'Olivia Williams',
    phone: '+1 (555) 345-6789',
    email: 'olivia.williams@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    lastOnline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    isOnline: false,
  },
  {
    id: 'contact-4',
    name: 'Noah Brown',
    phone: '+1 (555) 456-7890',
    email: 'noah.brown@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    lastOnline: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isOnline: true,
  },
  {
    id: 'contact-5',
    name: 'Ava Jones',
    phone: '+1 (555) 567-8901',
    email: 'ava.jones@example.com',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    lastOnline: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    isOnline: false,
  },
  {
    id: 'contact-6',
    name: 'Liam Miller',
    phone: '+1 (555) 678-9012',
    email: 'liam.miller@example.com',
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    lastOnline: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    isOnline: false,
  },
  {
    id: 'contact-7',
    name: 'Sophia Davis',
    phone: '+1 (555) 789-0123',
    email: 'sophia.davis@example.com',
    avatar: 'https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    lastOnline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    isOnline: false,
  },
  {
    id: 'contact-8',
    name: 'Mason Wilson',
    phone: '+1 (555) 890-1234',
    email: 'mason.wilson@example.com',
    avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    lastOnline: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
    isOnline: false,
  },
];