import { motion } from 'motion/react';
import { ArrowRight, BookOpen, PenTool, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase bg-black/5 text-black/60 rounded-full">
            The Future of Academic Excellence
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6 leading-[1.1]">
            Elevate Your Academic <br />
            <span className="text-black/40 italic font-serif">Journey with Lexora</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-black/60 mb-10">
            Professional content generation for students. From assignment drafts to PhD proposals, 
            we help you articulate your ideas with precision and academic integrity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-black/80 transition-all flex items-center justify-center gap-2">
              Start Your Assignment <ArrowRight size={18} />
            </button>
            <button className="w-full sm:w-auto border border-black/10 px-8 py-4 rounded-full font-medium hover:bg-black/5 transition-all">
              View Sample Proposals
            </button>
          </div>
        </motion.div>

        {/* Stats/Social Proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-black/5 py-12"
        >
          <div>
            <div className="text-3xl font-bold mb-1">50k+</div>
            <div className="text-sm text-black/40 uppercase tracking-wider font-semibold">Assignments</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">12k+</div>
            <div className="text-sm text-black/40 uppercase tracking-wider font-semibold">PhD Proposals</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">98%</div>
            <div className="text-sm text-black/40 uppercase tracking-wider font-semibold">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">24/7</div>
            <div className="text-sm text-black/40 uppercase tracking-wider font-semibold">Expert Support</div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-black">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold">Academic Research</h3>
            <p className="text-black/60 leading-relaxed">
              Deep-dive research assistance for complex topics, ensuring your work is backed by credible sources.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-black">
              <PenTool size={24} />
            </div>
            <h3 className="text-xl font-bold">Proposal Writing</h3>
            <p className="text-black/60 leading-relaxed">
              Crafting compelling PhD and research proposals that stand out to academic committees.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-black">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-xl font-bold">Thesis Support</h3>
            <p className="text-black/60 leading-relaxed">
              Comprehensive support for long-form academic writing, from structure to final citations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="bg-black rounded-[2rem] p-8 md:p-16 text-center text-white overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to excel in your studies?</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">
              Join thousands of students who have transformed their academic performance with Lexora.
            </p>
            <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-all">
              Get Started Now
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
        </div>
      </section>
    </div>
  );
}
