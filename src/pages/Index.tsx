import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Database, Users, Shield, TrendingUp, MapPin, Award, Clock } from 'lucide-react';
import heroImage from '@/assets/hero-farming.jpg';

const Index = () => {
  const benefits = [
    {
      icon: Database,
      title: "Comprehensive Soil Database",
      description: "Access detailed information about different soil types, their characteristics, and optimal growing conditions.",
    },
    {
      icon: Users,
      title: "Distributor Network",
      description: "Connect with verified seed and crop distributors to get the best products for your soil type.",
    },
    {
      icon: Shield,
      title: "Expert Verification",
      description: "All soil and crop information is verified by agricultural specialists and soil scientists.",
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Get intelligent recommendations based on your soil type and farming goals.",
    },
  ];

  const improvements = [
    "Increase crop yield by 30-40%",
    "Reduce fertilizer waste",
    "Make informed planting decisions",
    "Connect with verified distributors",
    "Access expert agricultural knowledge",
  ];

  const stats = [
    { value: "10,000+", label: "Happy Farmers", icon: Users },
    { value: "500+", label: "Soil Types", icon: Database },
    { value: "50+", label: "Countries", icon: MapPin },
    { value: "24/7", label: "Support", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Soil Farming Agent</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background z-0" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Trusted by 10,000+ Farmers</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Transform Your <span className="text-primary">Farming Results</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join thousands of farmers who have already improved their yields and reduced costs using our intelligent soil analysis platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="text-lg">
                  <Link to="/auth">Start Free Today</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg">
                  <Link to="/auth">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="Modern sustainable farming with technology"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Why Choose Soil Farming Agent?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge agricultural science with user-friendly technology to help farmers make better decisions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="animate-slide-up hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transform Results Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold mb-4">Transform Your Farming Results</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of farmers who have already improved their yields and reduced costs using our intelligent soil analysis platform.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 animate-slide-up">
              {improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                >
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="h-4 w-4 text-primary-foreground"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium">{improvement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center bg-gradient-to-br from-card to-muted/30 animate-slide-up">
            <CardHeader>
              <CardTitle className="text-4xl mb-4">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Join our community of successful farmers and start making data-driven decisions today.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/auth">Create Free Account</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No credit card required • Get started in minutes
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Soil Farming Agent</span>
            </div>
            <p className="text-muted-foreground text-center max-w-md">
              Empowering farmers with intelligent soil analysis and expert agricultural knowledge.
            </p>
            <div className="text-sm text-muted-foreground">
              © 2025 Soil Farming Agent. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
