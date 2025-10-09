import React from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { CustomerLayout } from '../components/CustomerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, ShieldCheck } from 'lucide-react';

/**
 * Profile page component
 * 
 * Displays user profile information in a clean, simple layout.
 * Shows user details like name, email, and role.
 */
export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal details and account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Section */}
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-lg font-semibold text-foreground">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>

            <Separator />

            {/* Email Section */}
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                <p className="text-lg font-semibold text-foreground">{user.email}</p>
              </div>
            </div>

            <Separator />

            {/* Role Section */}
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                <div className="mt-1">
                  <Badge 
                    variant={user.role === 'admin' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};
