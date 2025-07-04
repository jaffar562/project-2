import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Server, Globe, Shield, Zap, Users, Star, Menu, X, Check, ArrowRight, Gamepad2, Crown, Gem, Play, Sparkles, TrendingUp } from 'lucide-react';
import PaymentForm from './components/PaymentForm';
import DomainOrderForm from './components/DomainOrderForm';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState({ units: 0, backups: 0 });
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [domainSearch, setDomainSearch] = useState('');
  const [selectedTld, setSelectedTld] = useState('.com');
  const [selectedPlanType, setSelectedPlanType] = useState('budget');

  // Refs for smooth scrolling
  const budgetRef = useRef<HTMLDivElement>(null);
  const poweredRef = useRef<HTMLDivElement>(null);
  const premiumRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tlds = [
    { ext: '.com', price: '₹899', trending: true },
    { ext: '.net', price: '₹799', discount: true },
    { ext: '.org', price: '₹699' },
    { ext: '.in', price: '₹499', trending: true },
    { ext: '.tech', price: '₹1299' },
    { ext: '.online', price: '₹599', discount: true },
    { ext: '.store', price: '₹999' },
    { ext: '.fun', price: '₹799' },
    { ext: '.xyz', price: '₹299', discount: true },
    { ext: '.website', price: '₹899' },
    { ext: '.blog', price: '₹1099' },
    { ext: '.info', price: '₹699' },
    { ext: '.io', price: '₹2499' },
    { ext: '.live', price: '₹1199' }
  ];

  const budgetPlans = [
    {
      name: 'Dirt',
      planType: 'Budget',
      ram: '2GB RAM',
      cpu: '100% CPU',
      storage: '5GB SSD',
      location: 'India',
      price: '₹49',
      addons: { unit: '₹30', backup: '₹25' }
    },
    {
      name: 'Wood',
      planType: 'Budget',
      ram: '4GB RAM',
      cpu: '150% CPU',
      storage: '10GB SSD',
      location: 'Mumbai',
      price: '₹99',
      addons: { unit: '₹30', backup: '₹25' }
    },
    {
      name: 'Stone',
      planType: 'Budget',
      ram: '6GB RAM',
      cpu: '200% CPU',
      storage: '15GB SSD',
      location: 'Mumbai',
      price: '₹159',
      addons: { unit: '₹30', backup: '₹25' }
    },
    {
      name: 'Iron',
      planType: 'Budget',
      ram: '8GB RAM',
      cpu: '250% CPU',
      storage: '20GB SSD',
      location: 'Mumbai',
      price: '₹229',
      addons: { unit: '₹30', backup: '₹25' }
    },
    {
      name: 'Gold',
      planType: 'Budget',
      ram: '10GB RAM',
      cpu: '300% CPU',
      storage: '25GB SSD',
      location: 'Mumbai',
      price: '₹349',
      addons: { unit: '₹30', backup: '₹25' }
    },
    {
      name: 'Diamond',
      planType: 'Budget',
      ram: '12GB RAM',
      cpu: '350% CPU',
      storage: '30GB SSD',
      location: 'Mumbai',
      price: '₹399',
      addons: { unit: '₹30', backup: '₹25' }
    },
    {
      name: 'Netherite',
      planType: 'Budget',
      ram: '16GB RAM',
      cpu: '400% CPU',
      storage: '40GB SSD',
      location: 'Mumbai',
      price: '₹549',
      addons: { unit: '₹30', backup: '₹25' }
    }
  ];

  const poweredPlans = budgetPlans.map(plan => ({
    ...plan,
    planType: 'Powered',
    price: plan.name === 'Dirt' ? '₹90' :
           plan.name === 'Wood' ? '₹160' :
           plan.name === 'Stone' ? '₹240' :
           plan.name === 'Iron' ? '₹320' :
           plan.name === 'Gold' ? '₹400' :
           plan.name === 'Diamond' ? '₹480' : '₹640',
    addons: { unit: '₹50', backup: '₹25' }
  }));

  const premiumPlans = budgetPlans.map(plan => ({
    ...plan,
    planType: 'Premium',
    price: plan.name === 'Dirt' ? '₹149' :
           plan.name === 'Wood' ? '₹249' :
           plan.name === 'Stone' ? '₹449' :
           plan.name === 'Iron' ? '₹649' :
           plan.name === 'Gold' ? '₹799' :
           plan.name === 'Diamond' ? '₹899' : '₹999',
    addons: { unit: '₹129', backup: '₹25' }
  }));

  const testimonials = [
    {
      name: "Arjun Sharma",
      role: "Server Owner",
      content: "CraftDomains has been amazing! My server runs smoothly with zero downtime.",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Gaming Community",
      content: "Best hosting service in India. Great support and affordable pricing!",
      rating: 5
    },
    {
      name: "Rohit Kumar",
      role: "Developer",
      content: "Domain registration was instant and the hosting is blazing fast.",
      rating: 5
    }
  ];

  const handleDomainSearch = () => {
    if (domainSearch.trim()) {
      setSelectedDomain({
        domain: domainSearch.trim(),
        tld: selectedTld,
        price: tlds.find(t => t.ext === selectedTld)?.price || '₹899'
      });
      setCurrentPage('domain-order');
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setCurrentPage('checkout');
  };

  const scrollToPlanSection = (planType: string) => {
    setSelectedPlanType(planType);
    
    const refs = {
      budget: budgetRef,
      powered: poweredRef,
      premium: premiumRef
    };

    const targetRef = refs[planType as keyof typeof refs];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (currentPage === 'checkout' && selectedPlan) {
    return (
      <PaymentForm
        selectedPlan={selectedPlan}
        selectedAddons={selectedAddons}
        onBack={() => setCurrentPage('hosting')}
        theme="dark"
      />
    );
  }

  if (currentPage === 'domain-order' && selectedDomain) {
    return (
      <DomainOrderForm
        selectedDomain={selectedDomain}
        onBack={() => setCurrentPage('domains')}
        theme="dark"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CraftDomains</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setCurrentPage('home')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'home' ? 'text-purple-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('domains')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'domains' ? 'text-purple-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                Domains
              </button>
              <button
                onClick={() => setCurrentPage('hosting')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'hosting' ? 'text-purple-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                Hosting
              </button>
              <button
                onClick={() => setCurrentPage('comparison')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'comparison' ? 'text-purple-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                Compare
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setCurrentPage('domains');
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
              >
                Domains
              </button>
              <button
                onClick={() => {
                  setCurrentPage('hosting');
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
              >
                Hosting
              </button>
              <button
                onClick={() => {
                  setCurrentPage('comparison');
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
              >
                Compare
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Premium Home Page */}
      {currentPage === 'home' && (
        <>
          {/* Hero Section */}
          <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="max-w-7xl mx-auto text-center relative z-10">
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Premium Services for Indian Gamers</span>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  Power Your
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"> Digital Dreams</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                  Premium domain registration and blazing-fast Minecraft hosting designed specifically for Indian gamers. 
                  Choose your path to digital excellence.
                </p>
              </div>

              {/* Service Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                {/* Domain Service Card */}
                <div 
                  onClick={() => setCurrentPage('domains')}
                  className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden"
                >
                  {/* Card Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Globe className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Domain Registration</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      Secure your perfect domain with instant activation, premium extensions, and competitive pricing starting from ₹299.
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3" />
                        <span>Instant Domain Activation</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3" />
                        <span>Free DNS Management</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3" />
                        <span>Domain Privacy Protection</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center text-purple-400 group-hover:text-white transition-colors">
                      <span className="font-semibold mr-2">Get Started</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Hosting Service Card */}
                <div 
                  onClick={() => setCurrentPage('hosting')}
                  className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden"
                >
                  {/* Card Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Server className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Minecraft Hosting</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      High-performance Minecraft servers with Indian locations, 99.9% uptime, and plans starting from just ₹49/month.
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3" />
                        <span>Indian Server Locations</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3" />
                        <span>99.9% Uptime Guarantee</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3" />
                        <span>24/7 Premium Support</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center text-blue-400 group-hover:text-white transition-colors">
                      <span className="font-semibold mr-2">Choose Plan</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">10K+</div>
                  <div className="text-gray-400">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">24/7</div>
                  <div className="text-gray-400">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">5★</div>
                  <div className="text-gray-400">Rating</div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                <p className="text-gray-300 mb-6">Join thousands of satisfied customers who trust CraftDomains for their digital needs.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setCurrentPage('domains')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Register Domain
                  </button>
                  <button 
                    onClick={() => setCurrentPage('hosting')}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Start Hosting
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-white text-center mb-12">
                What Our Customers Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Domains Page */}
      {currentPage === 'domains' && (
        <>
          {/* Hero Section */}
          <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Find Your Perfect
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Domain</span>
                </h1>
                <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                  Register premium domains with instant activation, secure payments, and 99.9% uptime guarantee.
                </p>
              </div>

              {/* Domain Search */}
              <div className="max-w-4xl mx-auto mb-16">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Enter your domain name..."
                        value={domainSearch}
                        onChange={(e) => setDomainSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleDomainSearch()}
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={selectedTld}
                        onChange={(e) => setSelectedTld(e.target.value)}
                        className="appearance-none bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                      >
                        {tlds.map(tld => (
                          <option key={tld.ext} value={tld.ext} className="bg-slate-800">
                            {tld.ext} - {tld.price}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                    <button
                      onClick={handleDomainSearch}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {/* TLD Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-16">
                {tlds.map((tld, index) => (
                  <div
                    key={tld.ext}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer relative"
                    onClick={() => setSelectedTld(tld.ext)}
                  >
                    {tld.trending && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full">
                        🔥 Hot
                      </div>
                    )}
                    {tld.discount && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                        💸 Sale
                      </div>
                    )}
                    <div className="text-lg font-bold text-white">{tld.ext}</div>
                    <div className="text-purple-400 font-semibold">{tld.price}</div>
                  </div>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="flex items-center justify-center space-x-3 text-white">
                  <Shield className="w-8 h-8 text-green-400" />
                  <div>
                    <div className="font-semibold">99.9% Uptime</div>
                    <div className="text-sm text-gray-400">Guaranteed</div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-3 text-white">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <div>
                    <div className="font-semibold">Instant Activation</div>
                    <div className="text-sm text-gray-400">Within Minutes</div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-3 text-white">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <div>
                    <div className="font-semibold">Secure Payment</div>
                    <div className="text-sm text-gray-400">Protected</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Hosting Page */}
      {currentPage === 'hosting' && (
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Minecraft Server
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Hosting</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Premium Minecraft hosting designed for Indian gamers. Choose from Budget, Powered, or Premium plans.
              </p>
            </div>

            {/* Plan Type Selector */}
            <div className="mb-16">
              <div className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => scrollToPlanSection('budget')}
                      className={`flex items-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                        selectedPlanType === 'budget'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Gamepad2 className="w-5 h-5" />
                      <span>Budget Plans</span>
                      <span className="text-sm opacity-75">From ₹49</span>
                    </button>
                    <button
                      onClick={() => scrollToPlanSection('powered')}
                      className={`flex items-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                        selectedPlanType === 'powered'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Zap className="w-5 h-5" />
                      <span>Powered Plans</span>
                      <span className="text-sm opacity-75">From ₹90</span>
                    </button>
                    <button
                      onClick={() => scrollToPlanSection('premium')}
                      className={`flex items-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                        selectedPlanType === 'premium'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Crown className="w-5 h-5" />
                      <span>Premium Plans</span>
                      <span className="text-sm opacity-75">From ₹149</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Plans Section */}
            <div ref={budgetRef} className="mb-20">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl mb-6">
                  <Gamepad2 className="w-6 h-6" />
                  <span className="text-2xl font-bold">Budget Plans</span>
                </div>
                <p className="text-gray-300 text-lg">Perfect for small communities and personal servers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {budgetPlans.map((plan, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Gamepad2 className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold text-green-400 mb-2">{plan.price}<span className="text-lg text-gray-400">/mo</span></div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3" />
                        <span>{plan.ram}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3" />
                        <span>{plan.cpu}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3" />
                        <span>{plan.storage}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3" />
                        <span>{plan.location}</span>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 group-hover:shadow-lg">
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Powered Plans Section */}
            <div ref={poweredRef} className="mb-20">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl mb-6">
                  <Zap className="w-6 h-6" />
                  <span className="text-2xl font-bold">Powered Plans</span>
                </div>
                <p className="text-gray-300 text-lg">Enhanced performance for growing communities</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {poweredPlans.map((plan, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold text-blue-400 mb-2">{plan.price}<span className="text-lg text-gray-400">/mo</span></div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-blue-400 mr-3" />
                        <span>{plan.ram}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-blue-400 mr-3" />
                        <span>{plan.cpu}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-blue-400 mr-3" />
                        <span>{plan.storage}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-blue-400 mr-3" />
                        <span>{plan.location}</span>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 group-hover:shadow-lg">
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Plans Section */}
            <div ref={premiumRef} className="mb-20">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl mb-6">
                  <Crown className="w-6 h-6" />
                  <span className="text-2xl font-bold">Premium Plans</span>
                </div>
                <p className="text-gray-300 text-lg">Ultimate performance for professional servers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {premiumPlans.map((plan, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer group relative"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {plan.name === 'Diamond' && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full">
                        ⭐ Popular
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold text-purple-400 mb-2">{plan.price}<span className="text-lg text-gray-400">/mo</span></div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-purple-400 mr-3" />
                        <span>{plan.ram}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-purple-400 mr-3" />
                        <span>{plan.cpu}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-purple-400 mr-3" />
                        <span>{plan.storage}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-purple-400 mr-3" />
                        <span>{plan.location}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Gem className="w-5 h-5 text-purple-400 mr-3" />
                        <span>Premium Support</span>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 group-hover:shadow-lg">
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Comparison Page */}
      {currentPage === 'comparison' && (
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Compare
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Plans</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Choose the perfect plan for your needs. Compare features, pricing, and performance.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-6 text-white font-semibold">Features</th>
                      <th className="text-center p-6">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-2">
                            <Gamepad2 className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-white font-semibold">Budget</span>
                          <span className="text-green-400 text-sm">Starting ₹49/mo</span>
                        </div>
                      </th>
                      <th className="text-center p-6">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-2">
                            <Zap className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-white font-semibold">Powered</span>
                          <span className="text-blue-400 text-sm">Starting ₹90/mo</span>
                        </div>
                      </th>
                      <th className="text-center p-6">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-2">
                            <Crown className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-white font-semibold">Premium</span>
                          <span className="text-purple-400 text-sm">Starting ₹149/mo</span>
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full mt-1">
                            Recommended
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="p-6 text-gray-300">RAM Range</td>
                      <td className="p-6 text-center text-white">2GB - 16GB</td>
                      <td className="p-6 text-center text-white">2GB - 16GB</td>
                      <td className="p-6 text-center text-white">2GB - 16GB</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-6 text-gray-300">CPU Performance</td>
                      <td className="p-6 text-center text-white">100% - 400%</td>
                      <td className="p-6 text-center text-white">100% - 400%</td>
                      <td className="p-6 text-center text-white">100% - 400%</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-6 text-gray-300">Storage</td>
                      <td className="p-6 text-center text-white">5GB - 40GB SSD</td>
                      <td className="p-6 text-center text-white">5GB - 40GB SSD</td>
                      <td className="p-6 text-center text-white">5GB - 40GB SSD</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-6 text-gray-300">Location</td>
                      <td className="p-6 text-center text-white">India/Mumbai</td>
                      <td className="p-6 text-center text-white">India/Mumbai</td>
                      <td className="p-6 text-center text-white">India/Mumbai</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-6 text-gray-300">Extra Unit Cost</td>
                      <td className="p-6 text-center text-white">₹30/unit</td>
                      <td className="p-6 text-center text-white">₹50/unit</td>
                      <td className="p-6 text-center text-white">₹129/unit</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-6 text-gray-300">Backup Slots</td>
                      <td className="p-6 text-center text-white">₹25/slot</td>
                      <td className="p-6 text-center text-white">₹25/slot</td>
                      <td className="p-6 text-center text-white">₹25/slot</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-6 text-gray-300">Support Level</td>
                      <td className="p-6 text-center text-white">Standard</td>
                      <td className="p-6 text-center text-white">Enhanced</td>
                      <td className="p-6 text-center text-white">
                        <div className="flex items-center justify-center">
                          <Gem className="w-4 h-4 text-purple-400 mr-2" />
                          Premium
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-6 text-gray-300">Node Quality</td>
                      <td className="p-6 text-center text-white">Standard</td>
                      <td className="p-6 text-center text-white">Enhanced</td>
                      <td className="p-6 text-center text-white">
                        <div className="flex items-center justify-center">
                          <Crown className="w-4 h-4 text-purple-400 mr-2" />
                          Premium
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                Frequently Asked Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-3">Can I upgrade my plan later?</h3>
                  <p className="text-gray-300">Yes, you can upgrade your plan at any time. Contact our support team for seamless migration.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-3">What's the refund policy?</h3>
                  <p className="text-gray-300">We offer a 7-day money-back guarantee for all new customers. No questions asked.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-3">Do you provide server setup?</h3>
                  <p className="text-gray-300">Yes, our team can help set up your Minecraft server with your preferred plugins and configurations.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-3">What payment methods do you accept?</h3>
                  <p className="text-gray-300">We accept UPI, bank transfers, and all major credit/debit cards through secure payment gateways.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CraftDomains</span>
              </div>
              <p className="text-gray-400">Premium domain registration and Minecraft hosting for Indian gamers.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Domain Registration</li>
                <li>Minecraft Hosting</li>
                <li>Server Management</li>
                <li>Technical Support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Discord Community</li>
                <li>Knowledge Base</li>
                <li>Server Status</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Refund Policy</li>
                <li>Acceptable Use</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CraftDomains. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;