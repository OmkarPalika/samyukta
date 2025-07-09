'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Mail, Lock, AlertCircle } from 'lucide-react';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from 'next/link';
import { useForm } from "react-hook-form";

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: {email: string, password: string}) => {
    setLoading(true);
    setError('');

    try {
      await User.login(data);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center section-padding">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-spacing-lg">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Welcome Back</h1>
              <p className="text-sm sm:text-base text-gray-400">Sign in to your Samyukta account</p>
            </div>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="text-align-center">
              <div className="text-spacing">
                <CardTitle className="text-lg sm:text-xl text-white">Sign In</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-400">
                  Enter your credentials to access your account
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Card className="mb-4 sm:mb-6 bg-red-900/20 border-red-800">
                  <CardContent className="p-3 sm:p-4 flex items-center">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2" />
                    <p className="text-sm sm:text-base text-red-300">{error}</p>
                  </CardContent>
                </Card>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base text-gray-300">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <Input
                              type="email"
                              {...field}
                              className="pl-10 sm:pl-12 bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400 text-sm sm:text-base w-full"
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base text-gray-300">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <Input
                              type="password"
                              {...field}
                              className="pl-10 sm:pl-12 bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400 text-sm sm:text-base w-full"
                              placeholder="Enter your password"
                              required
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:shadow-lg transition-all neon-glow disabled:opacity-50 disabled:cursor-not-allowed py-2 sm:py-3 text-sm sm:text-base flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-sm sm:text-base text-gray-400">
                  Not registered yet?{' '}
                  <Link href="/register" className="text-blue-400 hover:text-blue-300">
                    Register here
                  </Link>
                </p>
              </div>

              {/* <Card className="mt-3 sm:mt-4 bg-gray-700/30 border-gray-600">
            <CardContent className="p-3 sm:p-4">
              <div className="text-spacing">
                <p className="text-gray-400 text-xs sm:text-sm">Demo credentials:</p>
                <p className="text-gray-300 text-xs sm:text-sm">Email: admin@samyukta.com</p>
                <p className="text-gray-300 text-xs sm:text-sm">Password: admin123</p>
              </div>
            </CardContent>
          </Card> */}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
