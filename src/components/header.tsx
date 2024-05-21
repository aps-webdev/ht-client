'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ModeToggle } from '@/components/theme-mode';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-provider';
import { _get } from '@/lib/api-client';
import { Github, LogOut, User } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const handleLogOut = async () => {
    await _get('auth/signout');
    localStorage.removeItem('token');
    logout();
    router.replace('/');
  };
  return (
    <header className='sticky top-0 z-50 backdrop-blur backdrop-filter'>
      <div className='mx-auto px-8 max-w-[90rem]'>
        <div className='flex items-center justify-between border-b px-4 py-5 sm:px-6 lg:px-8 xl:px-0'>
          <Link href='/' className='mr-8'>
            <Image
              src='/logo.png'
              alt='Mockify logo'
              width={100}
              height={100}
              priority
            />
          </Link>
          <div className='flex gap-8 items-center'>
            <nav className='text-lg'>
              <ul className='flex items-center gap-8'>
                <li>
                  <Link href='/'>Home</Link>
                </li>
                <li>
                  <Link href='/about'>About</Link>
                </li>
              </ul>
            </nav>
            {user ? (
              <Profile logOut={handleLogOut} />
            ) : (
              <Button onClick={() => router.push('/signin')}>
                Get Started
              </Button>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

const Profile = ({ logOut }: { logOut: () => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        tabIndex={0}
        aria-roledescription='profile picture'
        aria-expanded={false}>
        <Avatar className='cursor-pointer'>
          <Image src='/profile.png' alt='profile' width={120} height={120} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-48 p-2 mr-1.5'>
        <DropdownMenuLabel className='text-lg'>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer'>
          <Github className='mr-2 h-4 w-4' />
          <Link
            className='text-lg'
            href='https://github.com/aps-webdev/ht-client'
            rel='noopener noreferrer'
            target='_blank'>
            GitHub client
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer'>
          <Github className='mr-2 h-4 w-4' />
          <Link
            className='text-lg'
            href='https://github.com/aps-webdev/ht-server'
            rel='noopener noreferrer'
            target='_blank'>
            Github server
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer'>
          <LogOut className='mr-2 h-4 w-4' />
          <span className='text-lg' onClick={logOut}>
            Log out
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
