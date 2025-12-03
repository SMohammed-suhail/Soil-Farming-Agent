import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LogOut, Shield, Sprout, Users, Trash2, Edit, Search } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [mySoilData, setMySoilData] = useState<any[]>([]);
  const [myDistributors, setMyDistributors] = useState<any[]>([]);
  const [editingSoil, setEditingSoil] = useState<any>(null);
  const [editingDistributor, setEditingDistributor] = useState<any>(null);
  const [soilSearch, setSoilSearch] = useState('');
  const [distributorSearch, setDistributorSearch] = useState('');
  const [distributorTypeFilter, setDistributorTypeFilter] = useState<string>('all');
  const [newDistributorType, setNewDistributorType] = useState<string>('');

  useEffect(() => {
    if (!loading && (!user || userRole !== 'admin')) {
      navigate('/auth');
    }
  }, [user, userRole, loading, navigate]);

  useEffect(() => {
    if (user && userRole === 'admin') {
      fetchMyData();
    }
  }, [user, userRole]);

  const fetchMyData = async () => {
    if (!user) return;
    
    try {
      // Fetch only this admin's soil data
      const soilQuery = query(collection(db, 'soilData'), where('adminId', '==', user.uid));
      const soilSnapshot = await getDocs(soilQuery);
      setMySoilData(soilSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch only this admin's distributors
      const distQuery = query(collection(db, 'distributors'), where('adminId', '==', user.uid));
      const distSnapshot = await getDocs(distQuery);
      setMyDistributors(distSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSoilSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      await addDoc(collection(db, 'soilData'), {
        soilType: formData.get('soilType'),
        characteristics: formData.get('characteristics'),
        bestCrops: formData.get('bestCrops'),
        phLevel: formData.get('phLevel'),
        adminId: user?.uid,
        createdAt: new Date().toISOString(),
      });

      toast.success('Soil data added successfully!');
      form.reset();
      fetchMyData();
    } catch (error) {
      toast.error('Failed to add soil data');
      console.error('Error adding soil data:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDistributorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newDistributorType) {
      toast.error('Please select a distributor type');
      return;
    }
    
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      await addDoc(collection(db, 'distributors'), {
        name: formData.get('name'),
        contact: formData.get('contact'),
        location: formData.get('location'),
        type: newDistributorType,
        products: formData.get('products'),
        adminId: user?.uid,
        createdAt: new Date().toISOString(),
      });

      toast.success('Distributor added successfully!');
      form.reset();
      setNewDistributorType('');
      fetchMyData();
    } catch (error) {
      toast.error('Failed to add distributor');
      console.error('Error adding distributor:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast.success('Deleted successfully');
      fetchMyData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleSoilEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const soilRef = doc(db, 'soilData', editingSoil.id);
      await updateDoc(soilRef, {
        soilType: formData.get('soilType'),
        characteristics: formData.get('characteristics'),
        bestCrops: formData.get('bestCrops'),
        phLevel: formData.get('phLevel'),
        updatedAt: new Date().toISOString(),
      });

      toast.success('Soil data updated successfully!');
      setEditingSoil(null);
      fetchMyData();
    } catch (error) {
      toast.error('Failed to update soil data');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDistributorEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const distRef = doc(db, 'distributors', editingDistributor.id);
      await updateDoc(distRef, {
        name: formData.get('name'),
        contact: formData.get('contact'),
        location: formData.get('location'),
        type: formData.get('type'),
        products: formData.get('products'),
        updatedAt: new Date().toISOString(),
      });

      toast.success('Distributor updated successfully!');
      setEditingDistributor(null);
      fetchMyData();
    } catch (error) {
      toast.error('Failed to update distributor');
    } finally {
      setSubmitting(false);
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

  // Filter soil data based on search
  const filteredSoilData = mySoilData.filter(soil => 
    soil.soilType.toLowerCase().includes(soilSearch.toLowerCase()) ||
    soil.characteristics.toLowerCase().includes(soilSearch.toLowerCase()) ||
    soil.bestCrops.toLowerCase().includes(soilSearch.toLowerCase())
  );

  // Filter distributors based on search and type
  const filteredDistributors = myDistributors.filter(dist => {
    const matchesSearch = 
      dist.name.toLowerCase().includes(distributorSearch.toLowerCase()) ||
      dist.location.toLowerCase().includes(distributorSearch.toLowerCase()) ||
      dist.products.toLowerCase().includes(distributorSearch.toLowerCase());
    
    const matchesType = distributorTypeFilter === 'all' || dist.type === distributorTypeFilter;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-secondary animate-pulse mx-auto mb-4" />
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
            <Shield className="h-6 w-6 text-secondary" />
            <span className="text-xl font-bold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Logged in as: </span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Admin Control Panel</h1>
          <p className="text-muted-foreground">Manage soil information and distributor details</p>
        </div>

        <Tabs defaultValue="add-soil" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="add-soil">Add Soil</TabsTrigger>
            <TabsTrigger value="add-distributor">Add Distributor</TabsTrigger>
            <TabsTrigger value="my-soil">My Soil Data</TabsTrigger>
            <TabsTrigger value="my-distributors">My Distributors</TabsTrigger>
          </TabsList>

          <TabsContent value="add-soil" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-primary" />
                  Add Soil Information
                </CardTitle>
                <CardDescription>Add new soil type data for farmers</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSoilSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Input id="soilType" name="soilType" required placeholder="e.g., Clay Loam" />
                  </div>
                  <div>
                    <Label htmlFor="phLevel">pH Level</Label>
                    <Input id="phLevel" name="phLevel" required placeholder="e.g., 6.5-7.5" />
                  </div>
                  <div>
                    <Label htmlFor="characteristics">Characteristics</Label>
                    <Textarea id="characteristics" name="characteristics" required placeholder="Describe the soil characteristics..." />
                  </div>
                  <div>
                    <Label htmlFor="bestCrops">Best Crops</Label>
                    <Textarea id="bestCrops" name="bestCrops" required placeholder="List the best crops for this soil..." />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? 'Adding...' : 'Add Soil Data'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-distributor" className="animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-secondary" />
                  Add Distributor
                </CardTitle>
                <CardDescription>Add distributor information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDistributorSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Distributor Name</Label>
                    <Input id="name" name="name" required placeholder="e.g., Green Seeds Co." />
                  </div>
                  <div>
                    <Label htmlFor="contact">Contact</Label>
                    <Input id="contact" name="contact" required placeholder="e.g., +1 234 567 8900" />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" required placeholder="e.g., California, USA" />
                  </div>
                  <div>
                    <Label htmlFor="type">Distributor Type</Label>
                    <Select value={newDistributorType} onValueChange={setNewDistributorType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="products">Products</Label>
                    <Textarea id="products" name="products" required placeholder="List available products..." />
                  </div>
                  <Button type="submit" variant="secondary" disabled={submitting} className="w-full">
                    {submitting ? 'Adding...' : 'Add Distributor'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-soil" className="animate-slide-up">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search soil types, characteristics, or crops..."
                  value={soilSearch}
                  onChange={(e) => setSoilSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSoilData.length === 0 && mySoilData.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    You haven't added any soil data yet.
                  </CardContent>
                </Card>
              ) : filteredSoilData.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No soil data matches your search.
                  </CardContent>
                </Card>
              ) : (
                filteredSoilData.map((soil) => (
                  <Card key={soil.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span>{soil.soilType}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingSoil(soil)}
                          >
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete('soilData', soil.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>pH: {soil.phLevel}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{soil.characteristics}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-distributors" className="animate-slide-up">
            <div className="mb-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search distributors, locations, or products..."
                  value={distributorSearch}
                  onChange={(e) => setDistributorSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="type-filter" className="text-sm">Filter by type:</Label>
                <Select value={distributorTypeFilter} onValueChange={setDistributorTypeFilter}>
                  <SelectTrigger id="type-filter" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDistributors.length === 0 && myDistributors.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    You haven't added any distributors yet.
                  </CardContent>
                </Card>
              ) : filteredDistributors.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No distributors match your search or filter.
                  </CardContent>
                </Card>
              ) : (
                filteredDistributors.map((dist) => (
                  <Card key={dist.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span>{dist.name}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingDistributor(dist)}
                          >
                            <Edit className="h-4 w-4 text-secondary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete('distributors', dist.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>{dist.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-1">Type: <span className="font-medium">{dist.type}</span></p>
                      <p className="text-sm">Contact: {dist.contact}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Soil Dialog */}
      <Dialog open={!!editingSoil} onOpenChange={(open) => !open && setEditingSoil(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Soil Information</DialogTitle>
            <DialogDescription>Update the soil data details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSoilEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-soilType">Soil Type</Label>
              <Input id="edit-soilType" name="soilType" required defaultValue={editingSoil?.soilType} />
            </div>
            <div>
              <Label htmlFor="edit-phLevel">pH Level</Label>
              <Input id="edit-phLevel" name="phLevel" required defaultValue={editingSoil?.phLevel} />
            </div>
            <div>
              <Label htmlFor="edit-characteristics">Characteristics</Label>
              <Textarea id="edit-characteristics" name="characteristics" required defaultValue={editingSoil?.characteristics} />
            </div>
            <div>
              <Label htmlFor="edit-bestCrops">Best Crops</Label>
              <Textarea id="edit-bestCrops" name="bestCrops" required defaultValue={editingSoil?.bestCrops} />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setEditingSoil(null)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Distributor Dialog */}
      <Dialog open={!!editingDistributor} onOpenChange={(open) => !open && setEditingDistributor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Distributor</DialogTitle>
            <DialogDescription>Update the distributor details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDistributorEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Distributor Name</Label>
              <Input id="edit-name" name="name" required defaultValue={editingDistributor?.name} />
            </div>
            <div>
              <Label htmlFor="edit-contact">Contact</Label>
              <Input id="edit-contact" name="contact" required defaultValue={editingDistributor?.contact} />
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input id="edit-location" name="location" required defaultValue={editingDistributor?.location} />
            </div>
            <div>
              <Label htmlFor="edit-type">Distributor Type</Label>
              <Select name="type" required defaultValue={editingDistributor?.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-products">Products/Services</Label>
              <Textarea id="edit-products" name="products" required defaultValue={editingDistributor?.products} />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setEditingDistributor(null)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={submitting} className="flex-1">
                {submitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
