import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import xeLogo from '/images/Xe-logo.png';
import aboutBg from '/images/akhil-yerabati-Q2uV5TkjNz8-unsplash.jpg';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: '',
      title: 'Innovation First',
      description: 'Pushing boundaries with cutting-edge technology and forward-thinking design.'
    },
    {
      icon: '',
      title: 'Precision Engineering',
      description: 'Every product is meticulously crafted for optimal performance and reliability.'
    },
    {
      icon: '',
      title: 'Premium Quality',
      description: 'Exceptional materials and finishes that stand the test of time.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '100+', label: 'Products' },
    { number: '15+', label: 'Countries' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-purple-700 to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        {/* Animated Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse animation-delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div 
              className={`text-center mb-16 flex flex-col bg-black p-5 rounded-2xl justify-center items-center transition-all duration-1000 ease-out transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse animation-delay-500"></div>
 
              <img src={xeLogo} alt="xe-tech logo" width="200" />
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                Where <span className="text-purple-400 font-semibold">innovation</span> meets{' '}
                <span className="text-pink-400 font-semibold">elegance</span>. We're crafting the future of{' '}
                <span className="text-blue-400 font-semibold">technology</span>, one revolutionary product at a time.
              </p>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center transition-all duration-1000 ease-out transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{
                    transitionDelay: `${index * 200}ms`,
                    backdropFilter: 'blur(16px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(254, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem 1rem'
                  }}
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div 
                className={`transition-all duration-1000 ease-out transform ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Shaping Tomorrow's Technology
                </h2>
                <div className="space-y-6 text-gray-300 text-lg text-center leading-relaxed">
                  <p className='text-center'>
                    At <span className="text-purple-400 font-semibold">XE-Tech</span>, we believe technology should be both powerful and beautiful. 
                    Our journey began with a simple vision: to create devices that don't just keep up with the future, but define it.
                  </p>
                  <p>
                    Every product we design is a fusion of <span className="text-pink-400 font-semibold">artistic vision</span> and{' '}
                    <span className="text-blue-400 font-semibold">technical excellence</span>. We're not just building gadgets; 
                    we're crafting experiences that inspire and empower.
                  </p>
                  <p>
                    Join us as we continue to push the boundaries of what's possible, creating technology that enhances lives 
                    and transforms how we interact with the digital world.
                  </p>
                </div>
              </div>

              {/* Right - Interactive Feature Showcase */}
              <div 
                className={`transition-all duration-1000 ease-out transform ${
                  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                <div 
                  className="relative rounded-2xl p-8 h-96"
                  style={{
                    backgroundImage: `url(${aboutBg})`, 
                    backgroundSize: 'cover',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 p-8 transition-all duration-500 ease-out backdrop-blur-sm rounded-2xl text-center ${
                        activeFeature === index ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div className="txt rounded-2xl z-50 p-4 flex flex-col justify-center items-center">
                        <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-purple-600 mb-4">{feature.title}</h3>
                        <p className="text-white font-bold z-50 text-lg">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Navigation Dots */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveFeature(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          activeFeature === index 
                            ? 'bg-purple-500 scale-125' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready for the Future?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of innovators and visionaries who have already embraced the XE-Tech experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, var(--Xe-purple-500), var(--Xe-pink-500))',
                  color: 'white',
                  boxShadow: '0 0 50px rgba(168, 85, 247, 0.5)'
                }}
              >
                Explore Products
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;