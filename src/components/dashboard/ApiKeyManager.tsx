'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ApiKeyManager() {
  const { user, setApiKey } = useAuth();
  const [key, setKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user?.apiKey) {
      setKey(user.apiKey);
    }
  }, [user]);

  const handleSave = () => {
    setApiKey(key);
    toast({
      title: 'API Key Saved',
      description: 'Your Gemini API key has been updated.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Gemini API Key Management
        </CardTitle>
        <CardDescription>
          Your Gemini API key is required for AI quiz generation. It is stored securely in your browser's local storage.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!user?.apiKey && (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>API Key Required</AlertTitle>
                <AlertDescription>
                    Please add your Gemini API key to enable AI-powered features.
                </AlertDescription>
            </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="api-key">Your API Key</Label>
          <div className="flex gap-2">
            <Input
              id="api-key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your Gemini API key"
            />
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Need a key?{' '}
          <Link
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            Get one from Google AI Studio
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
