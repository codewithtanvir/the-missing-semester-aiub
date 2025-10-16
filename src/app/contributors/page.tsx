'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Github, Heart, Users, Star, Award } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { BackToTop } from '@/components/back-to-top';

// Contributors data - easily update this array to add more contributors
const contributors = [
  {
    id: 1,
    name: "Tanvir Rahman",
    role: "Founder & Lead Developer",
    avatar: "TR",
    contributions: "Platform Development, UI/UX Design",
    github: "codewithtanvir",
    year: "2024 - Present",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    name: "Anonymous Contributors",
    role: "Content Contributors",
    avatar: "AC",
    contributions: "Course Notes & Solutions",
    github: null,
    year: "2024 - Present",
    color: "from-purple-500 to-purple-600"
  },
  // Add more contributors here as needed
  // {
  //   id: 3,
  //   name: "Your Name",
  //   role: "Role",
  //   avatar: "YN",
  //   contributions: "Your Contributions",
  //   github: "your-github",
  //   year: "Year",
  //   color: "from-green-500 to-green-600"
  // },
];

// Statistics
const stats = [
  { label: "Contributors", value: contributors.length.toString(), icon: Users },
  { label: "Resources Shared", value: "1000+", icon: Star },
  { label: "Students Helped", value: "5000+", icon: Heart },
];

export default function ContributorsPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 max-w-7xl">
        {/* Back Button */}
        <div className="mb-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors duration-300 font-light"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full mb-6">
            <Award className="h-4 w-4 text-neutral-600" />
            <span className="text-sm font-light text-neutral-600 uppercase tracking-wide">Hall of Fame</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extralight tracking-tight text-neutral-900 mb-6">
            Contributors
          </h1>
          
          <p className="text-lg sm:text-xl text-neutral-500 font-light max-w-2xl mx-auto">
            Meet the amazing people who make this platform possible by sharing knowledge and helping fellow students
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 text-center shadow-lg shadow-black/5 border border-neutral-100 hover:shadow-xl transition-all duration-300"
            >
              <stat.icon className="h-8 w-8 mx-auto mb-4 text-neutral-600" />
              <div className="text-4xl sm:text-5xl font-extralight text-neutral-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-500 font-light uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Contributors Grid */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-light text-neutral-900 mb-12 text-center">
            Our Amazing Contributors
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            {contributors.map((contributor, index) => (
              <div
                key={contributor.id}
                className="bg-white rounded-2xl p-8 shadow-lg shadow-black/5 border border-neutral-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
                onMouseEnter={() => setHoveredId(contributor.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                  <div className={`h-24 w-24 rounded-full bg-gradient-to-br ${contributor.color} flex items-center justify-center text-white text-2xl font-light shadow-lg mb-4 transition-transform duration-300 ${
                    hoveredId === contributor.id ? 'scale-110' : ''
                  }`}>
                    {contributor.avatar}
                  </div>
                  
                  <h3 className="text-xl font-light text-neutral-900 mb-1">
                    {contributor.name}
                  </h3>
                  
                  <p className="text-sm text-neutral-500 font-light">
                    {contributor.role}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                      Contributions
                    </p>
                    <p className="text-sm text-neutral-700 font-light">
                      {contributor.contributions}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                      Active Since
                    </p>
                    <p className="text-sm text-neutral-700 font-light">
                      {contributor.year}
                    </p>
                  </div>
                </div>

                {/* GitHub Link */}
                {contributor.github && (
                  <a
                    href={`https://github.com/${contributor.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-all duration-300 text-sm font-light"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Profile
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Want to Contribute Section */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-12 sm:p-16 text-center text-white animate-in fade-in zoom-in-95 duration-700 delay-500">
          <Heart className="h-12 w-12 mx-auto mb-6 text-white/80" />
          
          <h2 className="text-4xl sm:text-5xl font-extralight mb-6">
            Want to Contribute?
          </h2>
          
          <p className="text-lg text-white/80 font-light mb-8 max-w-2xl mx-auto">
            Share your notes, solutions, and resources to help fellow AIUB students. Your contribution can make a real difference!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <button className="px-8 py-4 bg-white text-neutral-900 rounded-2xl hover:bg-neutral-100 transition-all duration-300 font-light shadow-xl">
                Browse Courses
              </button>
            </Link>
            
            <a 
              href="https://github.com/codewithtanvir/the-missing-semester-aiub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-8 py-4 bg-transparent border-2 border-white/40 text-white rounded-2xl hover:bg-white/10 transition-all duration-300 font-light">
                View on GitHub
              </button>
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-neutral-400 font-light mt-12">
          Thank you to all our contributors for making education accessible to everyone
        </p>
      </main>

      <BackToTop />
    </div>
  );
}
