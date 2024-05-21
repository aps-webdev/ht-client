'use client';
import { useAuth } from '@/contexts/auth-provider';
import { _post } from '@/lib/api-client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

const signInFormSchema = z
  .object({
    email: z.string().email({
      message: 'Email must be a valid email type.',
    }),
    password: z.string().min(8, {
      message: 'Password do not match the requirement',
    }),
    remember: z.boolean().default(false),
  })
  .required();

const SignInForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const handleSignIn = async (formData: z.infer<typeof signInFormSchema>) => {
    try {
      const response = await _post('auth/signin', formData);
      if (response) {
        localStorage.setItem('token', response.data.token);
        login();
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className='w-full mt-24 flex items-center justify-center'>
      <Card className='p-10 w-1/2 shadow-xl'>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignIn)}
              className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <FormControl className=''>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full text-lg py-6'>
                Log in
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className='text-gray-500'>
            Do not have an account?{' '}
            <Link
              href='/'
              className='font-medium text-blue-500 hover:underline hover:text-blue-600'>
              Sign up here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInForm;
