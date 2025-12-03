import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LogOut, Sprout, Users, MapPin, Phone, Package, Leaf, TestTube } from 'lucide-react';
import { toast } from 'sonner';

interface SoilData {
  id: string;
  soilType: string;
  characteristics: string;
  bestCrops: string;
  phLevel: string;
}

interface DistributorData {
  id: string;
  name: string;
  contact: string;
  location: string;
  products: string;
}

const Dashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [soilData, setSoilData] = useState<SoilData[]>([]);
  const [distributors, setDistributors] = useState<DistributorData[]>([]);
  const [selectedSoil, setSelectedSoil] = useState<SoilData | null>(null);
  const [selectedDistributor, setSelectedDistributor] = useState<DistributorData | null>(null);

  useEffect(() => {
    if (!loading && (!user || userRole !== 'farmer')) {
      navigate('/auth');
    }
  }, [user, userRole, loading, navigate]);

  useEffect(() => {
    if (user && userRole === 'farmer') {
      fetchData();
    }
  }, [user, userRole]);

  const fetchData = async () => {
    try {
      // Fetch all soil data
      const soilSnapshot = await getDocs(collection(db, 'soilData'));
      const soilList = soilSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SoilData[];
      setSoilData(soilList);

      // Fetch all distributors
      const distSnapshot = await getDocs(collection(db, 'distributors'));
      const distList = distSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DistributorData[];
      setDistributors(distList);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sprout className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Farmer Dashboard</span>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">Access soil information and find trusted distributors</p>
        </div>

        <div className="space-y-8">
          <section className="animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Sprout className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Soil Information</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {soilData.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No soil data available yet. Check back later!
                  </CardContent>
                </Card>
              ) : (
                soilData.map((soil) => (
                  <Card 
                    key={soil.id} 
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                    onClick={() => setSelectedSoil(soil)}
                  >
                    <CardHeader>
                      <CardTitle>{soil.soilType}</CardTitle>
                      <CardDescription>pH Level: {soil.phLevel}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Characteristics:</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{soil.characteristics}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Best Crops:</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{soil.bestCrops}</p>
                        </div>
                      </div>
                      <p className="text-xs text-primary mt-3 font-medium">Click for more details →</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>

          <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-6 w-6 text-secondary" />
              <h2 className="text-2xl font-semibold">Distributors</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {distributors.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No distributors available yet. Check back later!
                  </CardContent>
                </Card>
              ) : (
                distributors.map((dist) => (
                  <Card 
                    key={dist.id} 
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                    onClick={() => setSelectedDistributor(dist)}
                  >
                    <CardHeader>
                      <CardTitle>{dist.name}</CardTitle>
                      <CardDescription>{dist.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Contact:</p>
                          <p className="text-sm text-muted-foreground">{dist.contact}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Products:</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{dist.products}</p>
                        </div>
                      </div>
                      <p className="text-xs text-secondary mt-3 font-medium">Click for more details →</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Soil Detail Modal */}
      <Dialog open={!!selectedSoil} onOpenChange={() => setSelectedSoil(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sprout className="h-6 w-6 text-primary" />
              {selectedSoil?.soilType}
            </DialogTitle>
            <DialogDescription>Complete soil information and recommendations</DialogDescription>
          </DialogHeader>
          {selectedSoil && (
            <div className="space-y-6 mt-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <TestTube className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">pH Level</h3>
                    <p className="text-sm text-muted-foreground">{selectedSoil.phLevel}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Leaf className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Characteristics</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedSoil.characteristics}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Sprout className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Best Crops</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedSoil.bestCrops}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setSelectedSoil(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Distributor Detail Modal */}
      <Dialog open={!!selectedDistributor} onOpenChange={() => setSelectedDistributor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Users className="h-6 w-6 text-secondary" />
              {selectedDistributor?.name}
            </DialogTitle>
            <DialogDescription>Distributor contact and product information</DialogDescription>
          </DialogHeader>
          {selectedDistributor && (
            <div className="space-y-6 mt-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <MapPin className="h-5 w-5 text-secondary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-sm text-muted-foreground">{selectedDistributor.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Phone className="h-5 w-5 text-secondary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Contact Information</h3>
                    <p className="text-sm text-muted-foreground">{selectedDistributor.contact}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Package className="h-5 w-5 text-secondary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Available Products</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedDistributor.products}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button variant="secondary" onClick={() => setSelectedDistributor(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
