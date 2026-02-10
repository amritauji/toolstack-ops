"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProductDemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleFeatures, setVisibleFeatures] = useState(new Set());
  const sectionRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleFeatures(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureElements = sectionRef.current?.querySelectorAll('[data-index]');
    featureElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: "Kanban Boards",
      description: "Visualize your workflow with customizable boards that adapt to your team's process.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17H7m0 0a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2H7m0 0v4a2 2 0 002 2h6a2 2 0 002-2v-4m6 0V9a2 2 0 00-2-2h-2m-4 0V5a2 2 0 011-1.732l3-1.732a2 2 0 011 1.732V7a2 2 0 01-1 1.732l-3 1.732a2 2 0 01-1-1.732z" />
        </svg>
      ),
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Real-time Collaboration",
      description: "See changes instantly as your team works together, no refresh needed.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      title: "Advanced Analytics",
      description: "Get insights into team performance and project progress with detailed reports.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Smart Automation",
      description: "Automate repetitive tasks and workflows to focus on what matters most.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <section id="demo" ref={sectionRef} className={`py-24 ${isDark ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-slate-50 to-white'} relative overflow-hidden`}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDark ? 'bg-gradient-to-r from-indigo-600/10 to-purple-600/10' : 'bg-gradient-to-r from-indigo-400/10 to-purple-400/10'} rounded-full blur-3xl`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${isDark ? 'bg-gradient-to-r from-emerald-600/10 to-teal-600/10' : 'bg-gradient-to-r from-emerald-400/10 to-teal-400/10'} rounded-full blur-3xl`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${isDark ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-700/50' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200/50'} border mb-6`}>
            <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2 animate-pulse" />
            <span className={`text-sm font-medium ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
              See It In Action
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className={`bg-gradient-to-r ${isDark ? 'from-slate-100 to-slate-300' : 'from-slate-900 to-slate-700'} bg-clip-text text-transparent`}>
              See ToolStack Ops
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              in action
            </span>
          </h2>
          <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-slate-600'} max-w-3xl mx-auto leading-relaxed`}>
            Watch how teams transform their workflow and boost productivity by 40% on average.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Video Player */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl transform rotate-1" />
            <div className={`relative ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-3xl shadow-2xl ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'} border overflow-hidden`}>
              <div className={`${isDark ? 'bg-gradient-to-r from-slate-800 to-slate-700' : 'bg-gradient-to-r from-slate-50 to-slate-100'} px-6 py-4 ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'} border-b`}>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
              </div>
              <div className={`relative aspect-video ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-100 to-slate-200'}`}>
                {!isPlaying ? (
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <video
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    src="/videos/demo.mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          </div>

          {/* Features List */}
          <div>
            <h3 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'} mb-8`}>
              Everything you need to
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                manage projects better
              </span>
            </h3>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  data-index={index}
                  className={`group ${isDark ? 'bg-slate-800 border-slate-700/50 hover:border-slate-600/50' : 'bg-white border-slate-200/50 hover:border-slate-300/50'} rounded-2xl p-6 border hover:shadow-xl transition-all duration-500 ${visibleFeatures.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'} mb-2`}>
                        {feature.title}
                      </h4>
                      <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 text-center"
              >
                Start Free Trial
              </Link>
              <a 
                href="#testimonials" 
                className={`${isDark ? 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'} px-8 py-4 rounded-xl font-semibold border hover:shadow-md transition-all duration-200 text-center`}
              >
                See Reviews
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
