"use client";

import { useState } from 'react';

export default function ModernDemo() {
  const [activeTab, setActiveTab] = useState(0);

  const demoTabs = [
    {
      title: "Kanban Boards",
      description: "Visualize your workflow with intuitive drag-and-drop boards",
      features: ["Drag & Drop", "Custom Columns", "Real-time Updates", "Team Collaboration"]
    },
    {
      title: "Time Tracking",
      description: "Track time automatically and generate detailed reports",
      features: ["Automatic Tracking", "Detailed Reports", "Billing Integration", "Team Analytics"]
    },
    {
      title: "Team Analytics",
      description: "Get insights into team performance and project progress",
      features: ["Performance Metrics", "Progress Tracking", "Custom Dashboards", "Export Reports"]
    }
  ];

  return (
    <section id="demo" className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm font-medium text-emerald-700">
              See It In Action
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Experience the power of
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              modern project management
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            See how ToolStack transforms the way teams work together. 
            Interactive demos that showcase real-world scenarios.
          </p>
        </div>

        {/* Demo Interface */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden">
          {/* Tab Navigation */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-slate-200/80">
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
              {demoTabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium sm:font-semibold transition-all duration-300 text-xs sm:text-sm lg:text-base ${
                    activeTab === index
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:shadow-md border border-slate-200'
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </div>

          {/* Demo Content */}
          <div className="p-4 sm:p-6 lg:p-10 xl:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              {/* Demo Description */}
              <div className="order-2 lg:order-1">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-6">
                  {demoTabs[activeTab].title}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                  {demoTabs[activeTab].description}
                </p>

                {/* Features List */}
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {demoTabs[activeTab].features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 sm:px-6 lg:px-8 py-3 sm:py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-200 text-sm sm:text-base">
                    Try Interactive Demo
                  </button>
                  <button className="bg-white text-slate-700 px-5 sm:px-6 lg:px-8 py-3 sm:py-3.5 rounded-xl font-semibold border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 text-sm sm:text-base">
                    Watch Video Tour
                  </button>
                </div>
              </div>

              {/* Demo Visual */}
              <div className="relative order-1 lg:order-2">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-3xl transform rotate-3" />
                <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200/50 p-6 sm:p-8 shadow-xl">
                  {/* Mock Interface */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                      <h4 className="font-semibold text-slate-800">{demoTabs[activeTab].title}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                        <div className="w-3 h-3 bg-amber-400 rounded-full" />
                        <div className="w-3 h-3 bg-red-400 rounded-full" />
                      </div>
                    </div>

                    {/* Content based on active tab */}
                    {activeTab === 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {['To Do', 'In Progress', 'Done'].map((column, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-lg p-4">
                            <h5 className="font-medium text-slate-700 mb-3 text-sm">{column}</h5>
                            <div className="space-y-2">
                              {[1, 2].map((item) => (
                                <div key={item} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                  <div className="w-full h-2 bg-slate-200 rounded mb-2" />
                                  <div className="w-3/4 h-2 bg-slate-200 rounded" />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 1 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="font-medium text-emerald-800 text-sm">Currently tracking: Design Review</span>
                          </div>
                          <span className="text-emerald-600 font-mono text-sm">02:34:12</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="text-2xl font-bold text-slate-900">8.5h</div>
                            <div className="text-sm text-slate-600">Today</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="text-2xl font-bold text-slate-900">42.3h</div>
                            <div className="text-sm text-slate-600">This Week</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 2 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <div className="text-2xl font-bold text-blue-900">94%</div>
                            <div className="text-sm text-blue-600">Completion Rate</div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                            <div className="text-2xl font-bold text-emerald-900">12</div>
                            <div className="text-sm text-emerald-600">Active Projects</div>
                          </div>
                        </div>
                        <div className="h-32 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg flex items-center justify-center">
                          <div className="text-slate-500">Analytics Chart</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}