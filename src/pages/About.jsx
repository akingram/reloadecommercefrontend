import { Users, Award, Truck, Shield } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Users,
      title: "Community Driven",
      description: "Connect buyers and sellers in a vibrant fashion marketplace"
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Every product is carefully vetted for authenticity and quality"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50 with tracking included"
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Your data and transactions are protected with enterprise security"
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      bio: "Former fashion buyer with 10+ years in retail"
    },
    {
      name: "Michael Chen",
      role: "Head of Technology",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Tech veteran passionate about e-commerce innovation"
    },
    {
      name: "Emma Davis",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Fashion designer turned digital creative strategist"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About FashionHub
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing fashion retail by connecting independent sellers 
            with style-conscious buyers in one beautiful marketplace.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                FashionHub was born from the belief that fashion should be accessible, 
                diverse, and sustainable. We empower independent sellers and boutique 
                brands to reach customers worldwide while providing shoppers with 
                unique, curated fashion finds.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Since our launch in 2020, we've facilitated over 100,000 transactions 
                and helped 5,000+ sellers build their fashion businesses.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                alt="Fashion store"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose FashionHub?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're more than just a marketplace - we're a community dedicated to making fashion better for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-card border border-border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate professionals working to make fashion more accessible and sustainable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-white">
              <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
              <p className="text-white/90">
                Supporting circular fashion and eco-conscious brands that care about our planet's future.
              </p>
            </div>
            <div className="text-white">
              <h3 className="text-xl font-semibold mb-3">Diversity</h3>
              <p className="text-white/90">
                Celebrating all styles, sizes, and backgrounds in our inclusive fashion community.
              </p>
            </div>
            <div className="text-white">
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-white/90">
                Continuously improving the shopping experience through technology and user feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're looking to shop unique fashion or sell your creations, 
            FashionHub is the perfect place to start your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/shop" 
              className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-md text-sm font-medium transition-colors"
            >
              Start Shopping
            </a>
            <a 
              href="/seller" 
              className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8 rounded-md text-sm font-medium transition-colors"
            >
              Become a Seller
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;