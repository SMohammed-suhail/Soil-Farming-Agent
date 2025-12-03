import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Sprout, Shield, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [farmerMode, setFarmerMode] = useState<'signin' | 'signup'>('signin');
  const [adminMode, setAdminMode] = useState<'signin' | 'signup'>('signin');

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>, role: 'admin' | 'farmer') => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store user role in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
      });

      toast.success(`Successfully registered as ${role}!`);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user role
      const userDoc = await import('firebase/firestore').then(mod => 
        mod.getDoc(doc(db, 'users', userCredential.user.uid))
      );
      
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        toast.success('Successfully signed in!');
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4 relative">
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>
      
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sprout className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Soil Farming Agent</h1>
          </div>
          <p className="text-muted-foreground">Access your agricultural intelligence platform</p>
        </div>

        <Tabs defaultValue="farmer" className="w-full animate-slide-up">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="farmer" className="gap-2">
              <Sprout className="h-4 w-4" />
              Farmer
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="farmer">
            <div className="max-w-md mx-auto">
              <Card key={farmerMode} className="animate-flip-in">
                <CardHeader>
                  <CardTitle>{farmerMode === 'signin' ? 'Sign In' : 'Sign Up'}</CardTitle>
                  <CardDescription>
                    {farmerMode === 'signin' ? 'Access your farmer dashboard' : 'Create your farmer account'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {farmerMode === 'signup' ? (
                    <form onSubmit={(e) => handleSignUp(e, 'farmer')} className="space-y-4">
                      <div>
                        <Label htmlFor="farmer-signup-name">Full Name</Label>
                        <Input id="farmer-signup-name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="farmer-signup-email">Email</Label>
                        <Input id="farmer-signup-email" name="email" type="email" required />
                      </div>
                      <div>
                        <Label htmlFor="farmer-signup-password">Password</Label>
                        <Input id="farmer-signup-password" name="password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div>
                        <Label htmlFor="farmer-signin-email">Email</Label>
                        <Input id="farmer-signin-email" name="email" type="email" required />
                      </div>
                      <div>
                        <Label htmlFor="farmer-signin-password">Password</Label>
                        <Input id="farmer-signin-password" name="password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </form>
                  )}
                  
                  <div className="text-center text-sm text-muted-foreground pt-2 border-t">
                    {farmerMode === 'signin' ? (
                      <>
                        Don't have an account?{' '}
                        <button 
                          type="button"
                          onClick={() => setFarmerMode('signup')} 
                          className="text-primary hover:underline font-medium"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button 
                          type="button"
                          onClick={() => setFarmerMode('signin')} 
                          className="text-primary hover:underline font-medium"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admin">
            <div className="max-w-md mx-auto">
              <Card key={adminMode} className="animate-flip-in">
                <CardHeader>
                  <CardTitle>{adminMode === 'signin' ? 'Admin Sign In' : 'Admin Sign Up'}</CardTitle>
                  <CardDescription>
                    {adminMode === 'signin' ? 'Access admin dashboard' : 'Create your admin account'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {adminMode === 'signup' ? (
                    <form onSubmit={(e) => handleSignUp(e, 'admin')} className="space-y-4">
                      <div>
                        <Label htmlFor="admin-signup-name">Full Name</Label>
                        <Input id="admin-signup-name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="admin-signup-email">Email</Label>
                        <Input id="admin-signup-email" name="email" type="email" required />
                      </div>
                      <div>
                        <Label htmlFor="admin-signup-password">Password</Label>
                        <Input id="admin-signup-password" name="password" type="password" required />
                      </div>
                      <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up as Admin'}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div>
                        <Label htmlFor="admin-signin-email">Email</Label>
                        <Input id="admin-signin-email" name="email" type="email" required />
                      </div>
                      <div>
                        <Label htmlFor="admin-signin-password">Password</Label>
                        <Input id="admin-signin-password" name="password" type="password" required />
                      </div>
                      <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </form>
                  )}
                  
                  <div className="text-center text-sm text-muted-foreground pt-2 border-t">
                    {adminMode === 'signin' ? (
                      <>
                        Don't have an account?{' '}
                        <button 
                          type="button"
                          onClick={() => setAdminMode('signup')} 
                          className="text-secondary hover:underline font-medium"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button 
                          type="button"
                          onClick={() => setAdminMode('signin')} 
                          className="text-secondary hover:underline font-medium"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
