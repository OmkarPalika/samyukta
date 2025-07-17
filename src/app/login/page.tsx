'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { ClientAuth } from '@/lib/client-auth';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from 'next/link';
import { useForm } from "react-hook-form";

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'auth'>('email');
  const [userRole, setUserRole] = useState<'admin' | 'coordinator' | 'participant' | null>(null);
  const router = useRouter();
  const { checkAuth } = useAuth();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      passkey: ''
    }
  });

  const checkEmail = async (email: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (result.exists && result.role) {
        setUserRole(result.role);
        setStep('auth');
      } else {
        setError('Email not found. Please check your email or register first.');
      }
    } catch (err) {
      console.error('Email check error:', err);
      setError('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: {email: string, password: string, passkey: string}) => {
    if (step === 'email') {
      await checkEmail(data.email);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const credential = userRole === 'participant' ? data.passkey : data.password;
      const result = await ClientAuth.login(data.email, credential);
      if (result) {
        await checkAuth();
        if (result.role === 'admin') {
          router.replace('/dashboard/admin');
        } else if (result.role === 'coordinator') {
          router.replace('/dashboard/coordinator');
        } else {
          router.replace('/dashboard');
        }
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message || 'Invalid credentials');
      } else {
        setError('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmail = () => {
    setStep('email');
    setUserRole(null);
    setError('');
    form.setValue('password', '');
    form.setValue('passkey', '');
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
                  {step === 'email' 
                    ? 'Enter your email to continue' 
                    : `Enter your ${userRole === 'participant' ? 'passkey' : 'password'} to sign in`
                  }
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
                              disabled={step === 'auth'}
                              className="pl-10 sm:pl-12 bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400 text-sm sm:text-base w-full disabled:opacity-50"
                              placeholder="Enter your email"
                              required
                            />
                            {step === 'auth' && (
                              <button
                                type="button"
                                onClick={goBackToEmail}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 text-sm"
                              >
                                Change
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {step === 'auth' && userRole && (
                    <>
                      {userRole === 'participant' ? (
                        <FormField
                          control={form.control}
                          name="passkey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base text-gray-300">Passkey</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                  <Input
                                    type="text"
                                    {...field}
                                    className="pl-10 sm:pl-12 bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400 text-sm sm:text-base w-full"
                                    placeholder="Enter your passkey"
                                    required
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
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
                      )}
                    </>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:shadow-lg transition-all neon-glow disabled:opacity-50 disabled:cursor-not-allowed py-2 sm:py-3 text-sm sm:text-base flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        {step === 'email' ? 'Checking...' : 'Signing in...'}
                      </>
                    ) : (
                      <>
                        {step === 'email' ? (
                          <>
                            Continue <ArrowRight className="ml-2 w-4 h-4" />
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </>
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
