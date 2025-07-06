import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Globe, CheckCircle, Star, TrendingUp, Tag, Flame, ArrowRight } from 'lucide-react';

interface DomainPageProps {
  theme?: string;
  onBack: () => void;
  onDomainSelect: (domain: any) => void;
}

const DomainPage: React.FC<DomainPageProps> = ({ theme = 'dark', onBack, onDomainSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const supportedTLDs = [
    { name: ".fun", price: "₹149/year", discount: true },
    { name: ".xyz", price: "₹199/year", discount: true },
    { name: ".com", price: "₹999/year", featured: true },
    { name: ".net", price: "₹899/year" },
    { name: ".tech", price: "₹349/year" },
    { name: ".online", price: "₹249/year", trending: true },
    { name: ".in", price: "₹699/year" },
    { name: ".store", price: "₹499/year" },
    { name: ".org", price: "₹799/year" },
    { name: ".website", price: "₹299/year", discount: true },
    { name: ".blog", price: "₹399/year" },
    { name: ".info", price: "₹599/year" },
    { name: ".io", price: "₹1999/year", premium: true },
    { name: ".live", price: "₹399/year" },
    { name: ".dev", price: "₹1299/year", trending: true },
    { name: ".app", price: "₹1599/year", premium: true },
    { name: ".cloud", price: "₹799/year" },
    { name: ".game", price: "₹2499/year", premium: true },
    { name: ".pro", price: "₹1199/year" },
    { name: ".me", price: "₹899/year", trending: true }
  ];

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
          card: 'bg-white/80 backdrop-blur-xl border-white/40',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          pinkButton: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
          searchBg: 'bg-white/90',
          searchBorder: 'border-gray-300',
          domainCard: 'bg-pink-50/80 backdrop-blur-xl border-pink-200',
          domainBorder: 'border-pink-300',
          shadow: 'shadow-lg shadow-pink-200/50 hover:shadow-pink-300/60'
        };
      case 'glass':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 backdrop-blur-sm',
          pinkButton: 'bg-gradient-to-r from-pink-500/80 to-rose-500/80 hover:from-pink-600/80 hover:to-rose-600/80',
          searchBg: 'bg-white/5',
          searchBorder: 'border-white/20',
          domainCard: 'bg-pink-500/5 backdrop-blur-xl border-pink-500/20',
          domainBorder: 'border-pink-500/30',
          shadow: 'shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40'
        };
      default: // dark
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          pinkButton: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
          searchBg: 'bg-white/10',
          searchBorder: 'border-white/20',
          domainCard: 'bg-pink-900/10 backdrop-blur-xl border-pink-500/20',
          domainBorder: 'border-pink-500/30',
          shadow: 'shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const filteredTLDs = useMemo(() => {
    return supportedTLDs.filter(tld =>
      tld.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getTagInfo = (tld: any) => {
    if (tld.featured) {
      return {
        icon: <Star className="w-3 h-3" />,
        text: "Popular",
        bgClass: "bg-gradient-to-r from-yellow-500 to-orange-500",
        pulseClass: "animate-pulse"
      };
    }
    if (tld.trending) {
      return {
        icon: <TrendingUp className="w-3 h-3" />,
        text: "Trending",
        bgClass: "bg-gradient-to-r from-green-500 to-emerald-500",
        pulseClass: "animate-pulse"
      };
    }
    if (tld.discount) {
      return {
        icon: <Tag className="w-3 h-3" />,
        text: "Discount",
        bgClass: "bg-gradient-to-r from-red-500 to-pink-500",
        pulseClass: "animate-pulse"
      };
    }
    if (tld.premium) {
      return {
        icon: <Flame className="w-3 h-3" />,
        text: "Premium",
        bgClass: "bg-gradient-to-r from-purple-500 to-indigo-500",
        pulseClass: "animate-pulse"
      };
    }
    return null;
  };

  const handleDomainSearch = () => {
    if (!searchQuery.trim()) return;
    
    const results = supportedTLDs.map(ext => ({
      domain: searchQuery.toLowerCase().replace(/\s+/g, ''),
      tld: ext.name,
      price: ext.price,
      available: Math.random() > 0.3
    }));
    
    setSearchResults(results);
  };

  const handleDomainSelect = (domain: any) => {
    onDomainSelect(domain);
  };

  return (
    <div className={`min-h-screen ${themeStyles.bg} font-['Inter',sans-serif]`}>
      {/* Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className={`flex items-center ${themeStyles.textSecondary} hover:text-purple-400 transition-colors mb-8`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className={`text-5xl md:text-6xl font-bold ${themeStyles.text} mb-6`}>
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Domain
              </span>
            </h1>
            <p className={`text-xl ${themeStyles.textSecondary} mb-12 max-w-3xl mx-auto`}>
              Secure your digital identity with premium domain extensions. Instant activation, competitive pricing, and full DNS control.
            </p>

            {/* Domain Search */}
            <div className={`max-w-2xl mx-auto ${themeStyles.card} p-6 rounded-2xl border ${themeStyles.shadow} mb-12`}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeStyles.textMuted} w-5 h-5`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter your domain name..."
                    className={`w-full pl-12 pr-4 py-4 ${themeStyles.searchBg} ${themeStyles.searchBorder} border rounded-xl ${themeStyles.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300`}
                    onKeyPress={(e) => e.key === 'Enter' && handleDomainSearch()}
                  />
                </div>
                <button
                  onClick={handleDomainSearch}
                  className={`${themeStyles.pinkButton} text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center`}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className={`max-w-4xl mx-auto ${themeStyles.card} p-6 rounded-2xl border mb-12`}>
                <h3 className={`text-2xl font-bold ${themeStyles.text} mb-6`}>Search Results for "{searchQuery}"</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((result: any, index) => (
                    <div key={index} className={`${themeStyles.domainCard} p-4 rounded-xl border ${themeStyles.domainBorder} flex items-center justify-between`}>
                      <div className="flex items-center">
                        <Globe className="w-6 h-6 text-pink-400 mr-3" />
                        <div>
                          <div className={`font-semibold ${themeStyles.text}`}>{result.domain}{result.tld}</div>
                          <div className={`text-sm ${result.available ? 'text-green-400' : 'text-red-400'}`}>
                            {result.available ? 'Available' : 'Taken'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${themeStyles.text}`}>{result.price}</div>
                        {result.available && (
                          <button
                            onClick={() => handleDomainSelect(result)}
                            className="text-pink-400 hover:text-pink-300 text-sm font-semibold transition-colors"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Domain Extensions List */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold ${themeStyles.text} mb-6`}>
              Domain Extensions
            </h2>
            <p className={`text-xl ${themeStyles.textSecondary} max-w-3xl mx-auto`}>
              Choose from our wide selection of domain extensions with competitive pricing and instant activation
            </p>
          </div>

          {/* Search Bar */}
          <div className={`max-w-2xl mx-auto mb-12 ${themeStyles.card} ${themeStyles.domainBorder} border rounded-2xl p-6 ${themeStyles.shadow} transition-all duration-300`}>
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeStyles.textMuted} w-5 h-5`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search domain extensions..."
                className={`w-full pl-12 pr-4 py-4 ${themeStyles.searchBg} ${themeStyles.searchBorder} border rounded-xl ${themeStyles.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300`}
              />
            </div>
            {searchTerm && (
              <div className={`mt-4 text-sm ${themeStyles.textMuted}`}>
                Found {filteredTLDs.length} extension{filteredTLDs.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </div>
            )}
          </div>

          {/* TLD Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredTLDs.map((tld, index) => {
              const tagInfo = getTagInfo(tld);
              
              return (
                <div
                  key={index}
                  className={`group relative ${themeStyles.domainCard} ${themeStyles.domainBorder} border rounded-xl p-6 text-center hover:scale-105 transition-all duration-500 ${themeStyles.shadow} cursor-pointer overflow-hidden`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Tag */}
                  {tagInfo && (
                    <div className={`absolute -top-2 -right-2 ${tagInfo.bgClass} text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${tagInfo.pulseClass} shadow-lg`}>
                      {tagInfo.icon}
                      <span className="font-semibold">{tagInfo.text}</span>
                    </div>
                  )}

                  {/* TLD Name */}
                  <div className={`relative text-2xl font-bold ${themeStyles.text} mb-3 group-hover:text-pink-400 transition-colors duration-300`}>
                    {tld.name}
                  </div>

                  {/* Price */}
                  <div className={`relative text-lg font-semibold ${themeStyles.textSecondary} mb-4`}>
                    {tld.price}
                  </div>

                  {/* Features */}
                  <div className={`relative text-xs ${themeStyles.textMuted} space-y-1`}>
                    <div>✓ Free DNS Management</div>
                    <div>✓ Privacy Protection</div>
                    <div>✓ 24/7 Support</div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-pink-500/30 transition-all duration-500"></div>
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg shadow-pink-500/20"></div>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredTLDs.length === 0 && searchTerm && (
            <div className={`text-center py-12 ${themeStyles.card} ${themeStyles.domainBorder} border rounded-2xl`}>
              <div className={`text-6xl mb-4`}>🔍</div>
              <h3 className={`text-xl font-semibold ${themeStyles.text} mb-2`}>No extensions found</h3>
              <p className={`${themeStyles.textMuted}`}>
                Try searching for a different extension or clear your search to see all available options.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
              >
                Show All Extensions
              </button>
            </div>
          )}

          {/* Bottom CTA */}
          <div className={`mt-16 text-center ${themeStyles.card} ${themeStyles.domainBorder} border rounded-2xl p-8 ${themeStyles.shadow}`}>
            <h3 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>
              Can't find the perfect extension?
            </h3>
            <p className={`${themeStyles.textSecondary} mb-6`}>
              Contact our domain experts for personalized recommendations and bulk pricing options.
            </p>
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/25">
              Contact Domain Expert
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DomainPage;