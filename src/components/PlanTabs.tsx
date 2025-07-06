import React, { useState } from 'react';
import { Gamepad2, Zap, Star, Shield, Crown, Gem } from 'lucide-react';
import PlanCard from './PlanCard';

interface PlanTabsProps {
  theme?: string;
  onPlanSelect?: (plan: any) => void;
}

const PlanTabs: React.FC<PlanTabsProps> = ({ theme = 'dark', onPlanSelect }) => {
  const [activeTab, setActiveTab] = useState('budget');

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

  const minecraftPlans = {
    budget: [
      {
        name: 'Dirt Plan',
        price: '₹49/mo',
        ram: '2GB',
        cpu: '100% CPU',
        storage: '5GB SSD',
        location: 'India',
        features: ['Free DDoS Protection'],
        addons: { unit: '₹30', backup: '₹25' },
        planType: 'budget'
      },
      {
        name: 'Wood Plan',
        price: '₹99/mo',
        ram: '4GB',
        cpu: '150% CPU',
        storage: '10GB SSD',
        location: 'Mumbai',
        features: ['Free DDoS Protection'],
        addons: { unit: '₹30', backup: '₹25' },
        planType: 'budget'
      },
      {
        name: 'Stone Plan',
        price: '₹159/mo',
        ram: '6GB',
        cpu: '200% CPU',
        storage: '15GB SSD',
        location: 'Mumbai',
        features: ['Free DDoS Protection'],
        addons: { unit: '₹30', backup: '₹25' },
        planType: 'budget'
      },
      {
        name: 'Iron Plan',
        price: '₹229/mo',
        ram: '8GB',
        cpu: '250% CPU',
        storage: '20GB SSD',
        location: 'Mumbai',
        features: ['Free DDoS Protection'],
        addons: { unit: '₹30', backup: '₹25' },
        planType: 'budget'
      },
      {
        name: 'Gold Plan',
        price: '₹349/mo',
        ram: '10GB',
        cpu: '300% CPU',
        storage: '25GB SSD',
        location: 'Mumbai',
        features: ['Free DDoS Protection'],
        addons: { unit: '₹30', backup: '₹25' },
        planType: 'budget'
      },
      {
        name: 'Diamond Plan',
        price: '₹399/mo',
        ram: '12GB',
        cpu: '350% CPU',
        storage: '30GB SSD',
        location: 'Mumbai',
        features: ['Free DDoS Protection'],
        addons: { unit: '₹30', backup: '₹25' },
        planType: 'budget'
      },
      {
        name: 'Netherite Plan',
        price: '₹549/mo',
        ram: '16GB',
        cpu: '400% CPU',
        storage: '40GB SSD',
        location: 'Mumbai',
        features: ['Free DDoS Protection'],
        addons: { unit: '₹30', backup: '₹25' },
        planType: 'budget'
      }
    ],
    powered: [
      {
        name: 'Dirt Plan',
        price: '₹90/mo',
        ram: '2GB',
        cpu: '100% CPU',
        storage: '5GB SSD',
        location: 'Mumbai',
        features: ['Powered by Ryzen 9'],
        addons: { unit: '₹50', backup: '₹25' },
        planType: 'powered'
      },
      {
        name: 'Wood Plan',
        price: '₹160/mo',
        ram: '4GB',
        cpu: '150% CPU',
        storage: '10GB SSD',
        location: 'Mumbai',
        features: ['Powered by Ryzen 9'],
        addons: { unit: '₹50', backup: '₹25' },
        planType: 'powered'
      },
      {
        name: 'Stone Plan',
        price: '₹240/mo',
        ram: '6GB',
        cpu: '200% CPU',
        storage: '15GB SSD',
        location: 'Mumbai',
        features: ['Powered by Ryzen 9'],
        addons: { unit: '₹50', backup: '₹25' },
        planType: 'powered'
      },
      {
        name: 'Iron Plan',
        price: '₹320/mo',
        ram: '8GB',
        cpu: '250% CPU',
        storage: '20GB SSD',
        location: 'Mumbai',
        features: ['Powered by Ryzen 9'],
        addons: { unit: '₹50', backup: '₹25' },
        planType: 'powered'
      },
      {
        name: 'Gold Plan',
        price: '₹400/mo',
        ram: '10GB',
        cpu: '300% CPU',
        storage: '25GB SSD',
        location: 'Mumbai',
        features: ['Powered by Ryzen 9'],
        addons: { unit: '₹50', backup: '₹25' },
        planType: 'powered'
      },
      {
        name: 'Diamond Plan',
        price: '₹480/mo',
        ram: '12GB',
        cpu: '350% CPU',
        storage: '30GB SSD',
        location: 'Mumbai',
        features: ['Powered by Ryzen 9'],
        addons: { unit: '₹50', backup: '₹25' },
        planType: 'powered'
      },
      {
        name: 'Netherite Plan',
        price: '₹640/mo',
        ram: '16GB',
        cpu: '400% CPU',
        storage: '40GB SSD',
        location: 'Mumbai',
        features: ['Powered by Ryzen 9'],
        addons: { unit: '₹50', backup: '₹25' },
        planType: 'powered'
      }
    ],
    premium: [
      {
        name: 'Dirt Plan',
        price: '₹149/mo',
        ram: '2GB',
        cpu: '100% CPU',
        storage: '5GB SSD',
        location: 'Mumbai',
        features: ['Premium Node Quality', 'Powered by Ryzen 9'],
        addons: { unit: '₹129', backup: '₹25' },
        planType: 'premium'
      },
      {
        name: 'Wood Plan',
        price: '₹249/mo',
        ram: '4GB',
        cpu: '150% CPU',
        storage: '10GB SSD',
        location: 'Mumbai',
        features: ['Premium Node Quality', 'Powered by Ryzen 9'],
        addons: { unit: '₹129', backup: '₹25' },
        planType: 'premium'
      },
      {
        name: 'Stone Plan',
        price: '₹449/mo',
        ram: '6GB',
        cpu: '200% CPU',
        storage: '15GB SSD',
        location: 'Mumbai',
        features: ['Premium Node Quality', 'Powered by Ryzen 9'],
        addons: { unit: '₹129', backup: '₹25' },
        planType: 'premium'
      },
      {
        name: 'Iron Plan',
        price: '₹649/mo',
        ram: '8GB',
        cpu: '250% CPU',
        storage: '20GB SSD',
        location: 'Mumbai',
        features: ['Premium Node Quality', 'Powered by Ryzen 9'],
        addons: { unit: '₹129', backup: '₹25' },
        planType: 'premium'
      },
      {
        name: 'Gold Plan',
        price: '₹799/mo',
        ram: '10GB',
        cpu: '300% CPU',
        storage: '25GB SSD',
        location: 'Mumbai',
        features: ['Premium Node Quality', 'Powered by Ryzen 9'],
        addons: { unit: '₹129', backup: '₹25' },
        planType: 'premium'
      },
      {
        name: 'Diamond Plan',
        price: '₹899/mo',
        ram: '12GB',
        cpu: '350% CPU',
        storage: '30GB SSD',
        location: 'Mumbai',
        features: ['Premium Node Quality', 'Powered by Ryzen 9'],
        addons: { unit: '₹129', backup: '₹25' },
        planType: 'premium'
      },
      {
        name: 'Netherite Plan',
        price: '₹999/mo',
        ram: '16GB',
        cpu: '400% CPU',
        storage: '40GB SSD',
        location: 'Mumbai',
        features: ['Premium Node Quality', 'Powered by Ryzen 9'],
        addons: { unit: '₹129', backup: '₹25' },
        planType: 'premium'
      }
    ]
  };

  const tabs = [
    {
      id: 'budget',
      name: 'Budget Plans',
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'powered',
      name: 'Powered Plans',
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'from-orange-500 to-yellow-500'
    },
    {
      id: 'premium',
      name: 'Premium Plans',
      icon: <Crown className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${themeStyles.text} mb-4`}>
            Minecraft Hosting Plans
          </h2>
          <p className={`text-lg sm:text-xl ${themeStyles.textSecondary}`}>
            Choose the perfect plan for your Minecraft server
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {minecraftPlans[activeTab as keyof typeof minecraftPlans].map((plan, index) => (
            <PlanCard
              key={index}
              plan={plan}
              planType={activeTab as 'budget' | 'powered' | 'premium'}
              isPopular={index === 1 && activeTab === 'powered'}
              theme={theme}
              onSelect={onPlanSelect}
            />
          ))}
        </div>

        {/* Bottom Info */}
        <div className={`mt-12 sm:mt-16 text-center ${themeStyles.card} p-6 sm:p-8 rounded-2xl border`}>
          <h3 className={`text-xl sm:text-2xl font-bold ${themeStyles.text} mb-4`}>
            Need a Custom Solution?
          </h3>
          <p className={`${themeStyles.textSecondary} mb-6 text-sm sm:text-base`}>
            Contact our team for enterprise solutions and bulk discounts.
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default PlanTabs;