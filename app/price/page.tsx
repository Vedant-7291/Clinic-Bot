'use client';

import { 
  DollarSign,
  Stethoscope,
  Heart,
  Brain,
  Baby,
  Activity,
  TrendingUp
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: any;
}

const services: Service[] = [
  {
    id: '1',
    name: 'General Consultation',
    description: 'Standard medical consultation with a general physician',
    price: 150,
    category: 'General',
    icon: Stethoscope,
  },
  {
    id: '2',
    name: 'Cardiology Checkup',
    description: 'Comprehensive heart health evaluation',
    price: 350,
    category: 'Cardiology',
    icon: Heart,
  },
  {
    id: '3',
    name: 'Neurology Consultation',
    description: 'Nervous system and brain health assessment',
    price: 400,
    category: 'Neurology',
    icon: Brain,
  },
  {
    id: '4',
    name: 'Pediatric Visit',
    description: "Children's health examination and consultation",
    price: 200,
    category: 'Pediatrics',
    icon: Baby,
  },
  {
    id: '5',
    name: 'Orthopedic Consultation',
    description: 'Musculoskeletal system evaluation',
    price: 300,
    category: 'Orthopedics',
    icon: Activity,
  },
  {
    id: '6',
    name: 'Telehealth Consultation',
    description: 'Remote consultation via video call',
    price: 120,
    category: 'General',
    icon: Stethoscope,
  },
];

const categories = ['All', 'General', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics'];

export default function PricePage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Pricing</h1>
        <p className="text-gray-500 text-sm mt-1">Service prices and treatment costs</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              category === 'All'
                ? 'bg-[#0A1628] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.id} className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#0A1628] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Icon size={24} />
                </div>
                <span className="text-sm font-medium text-[#1A3A5C] bg-blue-50 px-2 py-1 rounded-lg">
                  {service.category}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-[#0A1628] mb-1">{service.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{service.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-2xl font-bold text-[#0A1628]">${service.price}</p>
                </div>
                <button className="btn-primary text-sm flex items-center gap-2">
                  <TrendingUp size={16} />
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 card p-6 bg-[#0A1628] text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#1A3A5C] rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign size={24} className="text-[#3B82F6]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Insurance Information</h3>
            <p className="text-[#94A3B8] text-sm">
              We accept most major health insurance plans. Please contact our billing department at (555) 123-4567 for more information about coverage and payment options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}