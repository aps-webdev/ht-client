'use client';

import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from './ui/button';
import { _post } from '@/lib/api-client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

const signUpFormSchema = z
  .object({
    username: z.string().min(3, {
      message: 'Username must be at least 3 characters.',
    }),
    email: z.string().email({
      message: 'Email must be a valid email type.',
    }),
    password: z.string().min(8, {
      message: "Does'nt meet the strength requirement",
    }),
    tnc: z.boolean().default(false),
  })
  .required()
  .refine(({ tnc }) => tnc === true, {
    message: 'Please accept terms and conditions to create your account',
    path: ['tnc'],
  });

const SignUp = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      tnc: false,
    },
  });

  const handleSignUp = async (formData: z.infer<typeof signUpFormSchema>) => {
    try {
      const response = await _post('auth/signup', formData);
      if (response) {
        router.push('/signin');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <Card className='w-full p-8'>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignUp)}
            className='space-y-6'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='username'>Username</FormLabel>
                  <FormControl>
                    <Input
                      id='username'
                      placeholder='Choose unique username'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='email'>Email</FormLabel>
                  <FormControl>
                    <Input
                      id='email'
                      placeholder='Enter your email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='password'>Password</FormLabel>
                  <FormControl>
                    <Input
                      id='password'
                      type='password'
                      placeholder='Enter you password'
                      pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='text-xs'>
                    Password should contain atleast 8 charcters with one
                    capital, one lower case, one number and one special
                    character in it.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tnc'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>
                      <span className='text-gray-500'>I accept the </span>
                      <Link
                        className='font-medium text-primary-600 hover:underline hover:text-blue-500'
                        href='#'>
                        Terms and Conditions
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full text-lg py-6'>
              Create an account
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <span className='text-gray-500'>Already have an account?</span>&nbsp;
        <Link
          className='font-medium text-blue-600 hover:text-blue-500 hover:underline'
          href='/signin'>
          Login here
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
