import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle, Leaf, Heart, Shield } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      details: "support@elvananaturals.com",
      description: "Get help with orders, supplements, or wellness questions"
    },
    {
      icon: Phone,
      title: "Phone Support",
      details: "+234 (0) 800-ELVANA",
      description: "Monday - Friday, 9AM - 6PM WAT"
    },
    {
      icon: MapPin,
      title: "Headquarters",
      details: "12 Wellness Avenue, Lagos, Nigeria",
      description: "Visit our wellness center"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 9AM-6PM WAT",
      description: "Weekend support via email only"
    }
  ];

  const faqItems = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by visiting the Orders page in your account or clicking the tracking link in your shipping confirmation email."
    },
    {
      question: "What is your return policy?",
      answer: "We offer 30-day returns on unopened supplements. Products must be in original packaging. Free return shipping on orders over ₦50,000."
    },
    {
      question: "How do I become a seller?",
      answer: "Visit our Wellness Partner Dashboard to create your account. You'll need to provide business information and verify your credentials to start selling."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 30 countries worldwide. Shipping costs and delivery times vary by destination."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Heart className="h-5 w-5" />
            <span className="text-sm font-medium">Wellness Support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-emerald-100">
            Have questions? Our wellness support team is here to help!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-emerald-100 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-700">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Support</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="seller">Wellness Partner Inquiry</option>
                    <option value="supplement">Supplement Questions</option>
                    <option value="general">General Question</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-colors"
                    placeholder="Please describe your question or concern in detail..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 h-12 px-6 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Leaf className="h-6 w-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
              </div>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 hover:bg-emerald-50 rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">{info.title}</h4>
                      <p className="text-emerald-700 font-medium">{info.details}</p>
                      <p className="text-xs text-gray-600">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links - EXACTLY THE SAME STRUCTURE AND FUNCTIONALITY */}
            <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/orders" className="block text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                  Track Your Order
                </Link>
                <Link to="/seller" className="block text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                  Seller Center
                </Link>
                <Link to="/shop" className="block text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                  Browse Products
                </Link>
                <Link to="/about" className="block text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                  About Elvana Naturals
                </Link>
              </div>
            </div>

            {/* Quality Badge */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-emerald-600" />
                <h4 className="font-bold text-emerald-800">Quality Certified</h4>
              </div>
              <p className="text-sm text-emerald-700">
                All supplements are third-party tested and GMP certified for your peace of mind.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <HelpCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <p className="text-lg text-gray-600">
              Find answers to common questions below
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white border border-emerald-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg mb-3 text-gray-900">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 max-w-2xl mx-auto text-white shadow-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">Priority Support</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Need Immediate Help?</h3>
            <p className="text-emerald-100 mb-4">
              For urgent order issues or account problems, contact our priority support line:
            </p>
            <a 
              href="tel:+234800ELVANA" 
              className="inline-flex items-center justify-center bg-white text-emerald-700 hover:bg-emerald-50 h-12 px-6 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105"
            >
              Call Now: +234 (0) 800-ELVANA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;