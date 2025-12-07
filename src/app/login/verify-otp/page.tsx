'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);
  

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, you would verify the OTP here.
    // For this demo, any 6-digit OTP is considered valid.
    if (otp.length === 6) {
      // On successful verification, we check if the user needs onboarding.
      // The `isOnboarded` logic is handled by the redirect in the dashboard layout.
      router.push('/dashboard');
    } else {
      alert('Please enter a valid 6-digit OTP.');
    }
  };
  
  if (isLoading || !isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verify Your Account</CardTitle>
          <CardDescription>
            We've sent a verification code to <strong>{user?.email}</strong>. 
            (For this demo, enter any 6 digits).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code (OTP)</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
            <Button type="submit" className="w-full">
              Verify Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
