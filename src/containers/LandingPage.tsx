'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import SignUp from '@/components/sign-up-form';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const router = useRouter();
  return (
    <div className='flex flex-row h-full'>
      <div className='w-1/2 flex mt-20'>
        <div className='flex justify-center flex-col'>
          <h1 className='font-bold text-8xl' tabIndex={0}>
            HabitTracker
          </h1>
          <article className='text-justify mt-4 mb-8'>
            <span className='text-3xl'>
              Tool that allow you to build new good habits and reach goals. We
              offer an intuitive interface so you&apos;ll be able to start
              planning in seconds.
            </span>
          </article>
          <Button
            type='button'
            className='w-fit text-2xl py-8 px-6'
            onClick={() => router.push('/signin')}>
            Get Started
          </Button>
        </div>
      </div>
      <div className='w-1/2'>
        <div className=' pl-12 flex items-center justify-center'>
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
