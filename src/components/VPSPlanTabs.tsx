import React, { useState } from 'react';
import { Server, Zap, Star, Shield, Crown, Gem } from 'lucide-react';
import VPSPlanCard from './VPSPlanCard';

interface VPSPlanTabsProps {
  theme?: string;
  onPlanSelect?: (plan: any) => void;
}

const VPSPlanTabs: React.FC<VPSPlanTabsProps> = ({ theme = 'dark', onPlanSelect }) => {
  const [activeTab, setActiveTab] = useState('cheap');

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          card: 'bg-white/80 backdrop-blur-xl border-white/40',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          tabActive: 'bg-blue-500 text-white',
          tabInactive: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        };
      case 'glass':
        return {
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 backdrop-blur-sm',
          tabActive: 'bg-purple-500/80 text-white backdrop-blur-sm',
          tabInactive: 'bg-white/10 text-white/70 hover:bg-white/20'
        };
      default: // dark
        return {
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          tabActive: 'bg-purple-500 text-white',
          tabInactive: 'bg-white/10 text-gray-300 hover:bg-white/20'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const vpsPlans = {
    cheap: [
      {
        name: 'Stone Plan',
        price: '₹270/mo',
        priceUSD: '$2/mo',
        ram: '2GB',
        cpu: '1 vCPU',
        storage: '20GB SSD',
        bandwidth: '1TB',
        features: ['Basic DDoS Protection', 'Root Access', 'Instant Setup'],
        planType: 'cheap'
      },
      {
        name: 'Iron Plan',
        price: '₹455/mo',
        priceUSD: '$3/mo',
        ram: '4GB',
        cpu: '2 vCPU',
        storage: '40GB SSD',
        bandwidth: '2TB',
        features: ['Basic DDoS Protection', 'Root Access', 'Instant Setup'],
        planType: 'cheap'
      },
      {
        name: 'Gold Plan',
        price: '₹625/mo',
        priceUSD: '$5/mo',
        ram: '8GB',
        cpu: '4 vCPU',
        storage: '80GB SSD',
        bandwidth: '4TB',
        features: ['Basic DDoS Protection', 'Root Access', 'Instant Setup'],
        planType: 'cheap'
      },
      {
        name: 'Diamond Plan',
        price: '₹900/mo',
        priceUSD: '$9/mo',
        ram: '16GB',
        cpu: '6 vCPU',
        storage: '160GB SSD',
        bandwidth: '8TB',
        features: ['Basic DDoS Protection', 'Root Access', 'Instant Setup'],
        planType: 'cheap'
      },
      {
        name: 'Netherite Plan',
        price: '₹1300/mo',
        priceUSD: '$16/mo',
        ram: '32GB',
        cpu: '8 vCPU',
        storage: '320GB SSD',
        bandwidth: '32TB',
        features: ['Basic DDoS Protection', 'Root Access', 'Instant Setup'],
        planType: 'cheap'
      }
    ],
    powered: [
      {
        name: 'Dirt Professional',
        price: '₹800/mo',
        ram: '8GB',
        cpu: '4 Core',
        storage: '200GB SSD',
        bandwidth: '32TB',
        processor: 'V4 Processor',
        network: '200 MBPS',
        features: ['V4 Processor', 'Instant Delivery', 'Basic DDoS Protection'],
        planType: 'powered'
      },
      {
        name: 'Stone Essentials',
        price: '₹1500/mo',
        ram: '32GB',
        cpu: '4 Core',
        storage: '500GB SSD',
        bandwidth: '32TB',
        processor: 'V4 Processor',
        network: '200 MBPS',
        features: ['V4 Processor', 'Instant Delivery', 'Basic DDoS Protection'],
        planType: 'powered'
      },
      {
        name: 'Iron Professional',
        price: '₹2000/mo',
        ram: '64GB',
        cpu: '8 Core',
        storage: '500GB SSD',
        bandwidth: '32TB',
        processor: 'V4 Processor',
        network: '200 MBPS',
        features: ['V4 Processor', 'Instant Delivery', 'Basic DDoS Protection'],
        planType: 'powered'
      }
    ]
  };

  const tabs = [
    {
      id: 'cheap',
      name: 'Cheap Plans',
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'powered',
      name: 'Powered Plans',
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'from-orange-500 to-yellow-500'
    }
  ];

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${themeStyles.text} mb-4`}>
            VPS Hosting Plans
          </h2>
          <p className={`text-lg sm:text-xl ${themeStyles.textSecondary}`}>
            Choose the perfect VPS plan for your applications
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className={`${themeStyles.card} p-1 sm:p-2 rounded-xl sm:rounded-2xl border inline-flex flex-col sm:flex-row w-full sm:w-auto max-w-md sm:max-w-none`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base mb-1 sm:mb-0 ${
                  activeTab === tab.id
                    ? themeStyles.tabActive
                    : themeStyles.tabInactive
                }`}
              >
                {tab.icon}
                <span className="whitespace-nowrap">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className={`grid gap-4 sm:gap-6 ${
          activeTab === 'cheap' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}>
          {vpsPlans[activeTab as keyof typeof vpsPlans].map((plan, index) => (
            <VPSPlanCard
              key={index}
              plan={plan}
              planType={activeTab as 'cheap' | 'powered'}
              isPopular={index === 2 && activeTab === 'cheap'}
              theme={theme}
              onSelect={onPlanSelect}
            />
          ))}
        </div>

        {/* Bottom Info */}
        <div className={`mt-12 sm:mt-16 text-center ${themeStyles.card} p-6 sm:p-8 rounded-2xl border`}>
          <h3 className={`text-xl sm:text-2xl font-bold ${themeStyles.text} mb-4`}>
            Need a Custom VPS Solution?
          </h3>
          <p className={`${themeStyles.textSecondary} mb-6 text-sm sm:text-base`}>
            Contact our team for enterprise VPS solutions and bulk discounts.
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default VPSPlanTabs;