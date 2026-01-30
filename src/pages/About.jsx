import { Users, Award, Truck, Shield, Heart, Leaf, Brain, Droplets } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Leaf,
      title: "100% Natural Ingredients",
      description: "Pure, plant-based supplements with no artificial additives or fillers"
    },
    {
      icon: Award,
      title: "Lab Tested & Certified",
      description: "Every product undergoes third-party testing for purity and potency"
    },
    {
      icon: Truck,
      title: "Fast & Free Shipping",
      description: "Free delivery on orders over ₦50,000 with nationwide coverage"
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "Your health and satisfaction are protected with our wellness guarantee"
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer & Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      bio: "Board-certified nutritionist with 15+ years in natural medicine"
    },
    {
      name: "Dr. Michael Chen",
      role: "Head of Research & Development",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Pharmaceutical scientist specializing in natural supplement formulations"
    },
    {
      name: "Emma Davis",
      role: "Wellness Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Holistic health practitioner and certified nutrition specialist"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Heart className="h-5 w-5" />
            <span className="text-sm font-medium">Wellness First Since 2018</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Elvana Naturals
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-emerald-100">
            We're revolutionizing natural wellness by providing premium supplements 
            that bridge the gap between nature and optimal health.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-emerald-600 mb-4">
                <Leaf className="h-5 w-5" />
                <span className="text-sm font-medium">Our Story</span>
              </div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Wellness Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Elvana Naturals was founded on the belief that optimal health comes from nature. 
                We combine traditional herbal wisdom with modern scientific research to create 
                supplements that genuinely support your body's natural healing processes.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Since our founding in 2018, we've helped over 50,000 customers achieve their 
                health goals and partnered with 1,000+ wellness practitioners nationwide.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop"
                alt="Natural supplements and herbs"
                className="rounded-2xl shadow-xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-emerald-100 p-4 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-700">5,000+</div>
                  <div className="text-sm text-emerald-600">Wellness Transformations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-teal-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Why Choose Elvana Naturals?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the purest, most effective natural supplements available.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-white border border-emerald-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full mb-4">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Our Wellness Experts</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Meet Our Medical Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Board-certified professionals dedicated to your health and wellness journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg group-hover:border-emerald-100 transition-colors duration-300"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {member.role.includes('Dr.') ? 'MD' : 'Certified'}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1 text-gray-900">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 to-teal-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-white p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-6 w-6 text-emerald-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Purity First</h3>
              <p className="text-white/90">
                We never compromise on ingredient quality. Every product is 100% natural, 
                non-GMO, and free from artificial additives.
              </p>
            </div>
            <div className="text-white p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-emerald-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Science-Backed</h3>
              <p className="text-white/90">
                Combining traditional herbal wisdom with modern scientific research 
                for maximum effectiveness and safety.
              </p>
            </div>
            <div className="text-white p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-emerald-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Holistic Wellness</h3>
              <p className="text-white/90">
                Supporting complete mind-body health through natural solutions 
                that work with your body's innate healing abilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Certifications</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Independent verification of our commitment to quality and safety
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-10 w-10 text-emerald-600" />
              </div>
              <p className="font-semibold text-gray-800">GMP Certified</p>
              <p className="text-sm text-gray-600">Good Manufacturing Practice</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="h-10 w-10 text-emerald-600" />
              </div>
              <p className="font-semibold text-gray-800">Organic Certified</p>
              <p className="text-sm text-gray-600">USDA & EU Standards</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-10 w-10 text-emerald-600" />
              </div>
              <p className="font-semibold text-gray-800">Third-Party Tested</p>
              <p className="text-sm text-gray-600">Independent Lab Verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Transform Your Wellness?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered the power of natural supplements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/shop" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 h-12 px-8 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
            >
              Shop Supplements
            </a>
            <a 
              href="/consultation" 
              className="inline-flex items-center justify-center border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white h-12 px-8 rounded-full text-sm font-medium transition-colors"
            >
              Free Wellness Consultation
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-6 max-w-lg mx-auto">
            Have questions about which supplements are right for you? 
            Our wellness experts are here to help.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;