import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, MessageCircle, Send, CheckCircle, Gamepad2 } from 'lucide-react';

interface PaymentFormProps {
  selectedPlan: any;
  selectedAddons: any;
  onBack: () => void;
  theme: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ selectedPlan, selectedAddons, onBack, theme }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    country: '',
    discordUsername: '',
    serverName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const basePrice = parseInt(selectedPlan.price.replace('₹', ''));
    const unitsPrice = (selectedAddons?.units || 0) * parseInt(selectedPlan.addons.unit.replace('₹', ''));
    const backupsPrice = (selectedAddons?.backups || 0) * parseInt(selectedPlan.addons.backup.replace('₹', ''));
    return basePrice + unitsPrice + backupsPrice;
  };

  const sendToDiscord = async () => {
    const webhookUrl = 'https://discord.com/api/webhooks/1390708963229831180/iIcQEkMPv1_bWKzvg58UWBq-c84msuMit4Sh6aw5xa4HaCYyUgdl3fA82W8g2vZLofsp';

    const orderDetails = {
      embeds: [
        {
          title: "🎮 New Minecraft Hosting Order!",
          color: 0x7C3AED,
          fields: [
            {
              name: "👤 Customer Information",
              value: `**Name:** ${formData.firstName} ${formData.lastName}\n**Email:** ${formData.email}\n**Phone:** ${formData.phone}\n**Discord:** ${formData.discordUsername}`,
              inline: false
            },
            {
              name: "📍 Address",
              value: `${formData.address}\n${formData.state}, ${formData.country}`,
              inline: false
            },
            {
              name: "🎯 Plan Details",
              value: `**Plan:** ${selectedPlan.name} Plan\n**Type:** ${selectedPlan.planType}\n**RAM:** ${selectedPlan.ram}\n**CPU:** ${selectedPlan.cpu}\n**Storage:** ${selectedPlan.storage}\n**Location:** ${selectedPlan.location}`,
              inline: true
            },
            {
              name: "🔧 Add-ons",
              value: `**Extra Units:** ${selectedAddons?.units || 0}\n**Backup Slots:** ${selectedAddons?.backups || 0}`,
              inline: true
            },
            {
              name: "💰 Pricing",
              value: `**Base Price:** ₹${selectedPlan.price.replace('₹', '')}\n**Add-ons:** ₹${((selectedAddons?.units || 0) * parseInt(selectedPlan.addons.unit.replace('₹', ''))) + ((selectedAddons?.backups || 0) * parseInt(selectedPlan.addons.backup.replace('₹', '')))}\n**Total:** ₹${calculateTotal()}`,
              inline: true
            },
            {
              name: "🎮 Server Details",
              value: `**Server Name:** ${formData.serverName || 'Not specified'}`,
              inline: false
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "CraftDomains Minecraft Hosting"
          }
        }
      ]
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails)
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Failed to send to Discord');
      }
    } catch (error) {
      console.error('Error sending to Discord:', error);
      setIsSubmitted(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendToDiscord();
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Order Submitted Successfully!</h2>
          <p className="text-gray-300 mb-6">
            Your Minecraft hosting order has been received. Our team will contact you on Discord within 24 hours to set up your server.
          </p>
          <button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Plans
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-fit">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedPlan.name} Plan</h3>
                  <p className="text-gray-400">{selectedPlan.planType}</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xl font-bold text-white">{selectedPlan.price}</div>
                  <div className="text-sm text-gray-400">/month</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>RAM:</span>
                  <span>{selectedPlan.ram}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>CPU:</span>
                  <span>{selectedPlan.cpu}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Storage:</span>
                  <span>{selectedPlan.storage}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Location:</span>
                  <span>{selectedPlan.location}</span>
                </div>
              </div>
            </div>

            {(selectedAddons?.units > 0 || selectedAddons?.backups > 0) && (
              <div className="border-t border-white/20 pt-4 mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Add-ons</h4>
                {selectedAddons?.units > 0 && (
                  <div className="flex justify-between text-gray-300 mb-2">
                    <span>Extra Units ({selectedAddons.units})</span>
                    <span>₹{selectedAddons.units * parseInt(selectedPlan.addons.unit.replace('₹', ''))}</span>
                  </div>
                )}
                {selectedAddons?.backups > 0 && (
                  <div className="flex justify-between text-gray-300">
                    <span>Backup Slots ({selectedAddons.backups})</span>
                    <span>₹{selectedAddons.backups * parseInt(selectedPlan.addons.backup.replace('₹', ''))}</span>
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-white/20 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">Total</span>
                <span className="text-2xl font-bold text-purple-400">₹{calculateTotal()}/mo</span>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Customer Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Discord Username *
                </label>
                <input
                  type="text"
                  name="discordUsername"
                  value={formData.discordUsername}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter Discord username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter country"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Gamepad2 className="w-4 h-4 inline mr-2" />
                  Server Name (Optional)
                </label>
                <input
                  type="text"
                  name="serverName"
                  value={formData.serverName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter desired server name"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing Order...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Submit Order
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;