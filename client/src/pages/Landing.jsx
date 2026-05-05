import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Droplets, Shield, Clock, Users, Star, Phone,
  Check, ArrowRight, ChevronDown, Wrench, Zap,
  Award, HeadphonesIcon, MapPin, Mail,
} from 'lucide-react';
import api from '../services/api';

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── Navbar ─── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Droplets size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
            AquaCare
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">Features</a>
          <a href="#plans" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">AMC Plans</a>
          <a href="#testimonials" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">Reviews</a>
          <a href="#contact" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sky-600 hover:text-sky-700 font-semibold transition-colors">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-sky-200 transition-all duration-300 hover:-translate-y-0.5"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </nav>
  );
};

/* ─── Hero Section ─── */
const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
    {/* Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100" />
    <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-sky-200/30 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-3xl" />

    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Zap size={14} />
              Trusted by 10,000+ families across India
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight"
          >
            Pure Water,{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              Expert Care
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            India's most trusted RO servicing platform. Timely maintenance,
            genuine parts, certified technicians — all managed from one
            dashboard. Start your{' '}
            <strong className="text-sky-600">14-day free trial</strong> today.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-lg px-8 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-sky-200 transition-all duration-300 hover:-translate-y-1"
            >
              Start 14-Day Free Trial
              <ArrowRight size={20} />
            </Link>
            <a
              href="#plans"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 text-lg px-8 py-4 rounded-2xl font-semibold border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all duration-300"
            >
              View AMC Plans
              <ChevronDown size={20} />
            </a>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            variants={fadeUp}
            custom={4}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { value: '10K+', label: 'Happy Customers' },
              { value: '50K+', label: 'Services Done' },
              { value: '500+', label: 'Expert Technicians' },
              { value: '4.9★', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white">
                <div className="text-2xl md:text-3xl font-bold text-sky-600">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ─── Features Section ─── */
const features = [
  {
    icon: <Wrench size={28} />,
    title: 'Expert Technicians',
    desc: 'Certified & background-verified technicians with years of RO servicing experience.',
  },
  {
    icon: <Shield size={28} />,
    title: 'Genuine Parts',
    desc: 'Only authentic, manufacturer-grade spare parts and filters for maximum water purity.',
  },
  {
    icon: <Clock size={28} />,
    title: 'Scheduled Reminders',
    desc: 'Automatic service reminders via email so you never miss a scheduled maintenance.',
  },
  {
    icon: <HeadphonesIcon size={28} />,
    title: '24/7 Support',
    desc: 'Round-the-clock customer support via phone, email, and WhatsApp for emergencies.',
  },
  {
    icon: <Award size={28} />,
    title: 'Service Guarantee',
    desc: 'Every service backed by our satisfaction guarantee. Not happy? We fix it free.',
  },
  {
    icon: <Users size={28} />,
    title: 'Dedicated Dashboard',
    desc: 'Track services, payments, complaints, and receipts from your personal dashboard.',
  },
];

const Features = () => (
  <section id="features" className="py-24 bg-white">
    <div className="container mx-auto px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
        className="text-center mb-16"
      >
        <motion.span variants={fadeUp} className="text-sky-600 font-semibold text-sm uppercase tracking-widest">
          Why Choose AquaCare
        </motion.span>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
          Everything You Need for{' '}
          <span className="text-sky-600">Pure Water</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-slate-500 mt-4 max-w-xl mx-auto">
          From routine maintenance to emergency repairs, we&apos;ve got your RO system covered.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            className="group bg-slate-50 rounded-2xl p-8 hover:bg-gradient-to-br hover:from-sky-500 hover:to-blue-600 transition-all duration-500 hover:shadow-xl hover:shadow-sky-200 hover:-translate-y-1"
          >
            <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 group-hover:bg-white/20 group-hover:text-white transition-colors duration-500 mb-5">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-white transition-colors duration-500 mb-3">
              {feature.title}
            </h3>
            <p className="text-slate-500 group-hover:text-sky-100 transition-colors duration-500 leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ─── AMC Plans Section ─── */
const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get('/plans');
        setPlans(data.data.plans);
      } catch {
        console.error('Failed to fetch plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const planColors = [
    { gradient: 'from-slate-100 to-slate-50', badge: 'bg-slate-200 text-slate-700', border: 'border-slate-200' },
    { gradient: 'from-sky-500 to-blue-600', badge: 'bg-white/20 text-white', border: 'border-sky-400', text: 'text-white' },
    { gradient: 'from-indigo-100 to-purple-50', badge: 'bg-indigo-200 text-indigo-700', border: 'border-indigo-200' },
  ];

  return (
    <section id="plans" className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="text-sky-600 font-semibold text-sm uppercase tracking-widest">
            AMC Plans
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Choose Your{' '}
            <span className="text-sky-600">Protection Plan</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-500 mt-4 max-w-xl mx-auto">
            All plans include a 14-day free trial. No credit card required. Cancel anytime.
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {plans.map((plan, idx) => {
              const colors = planColors[idx] || planColors[0];
              const isPopular = plan.isPopular;

              return (
                <motion.div
                  key={plan._id}
                  variants={fadeUp}
                  className={`relative rounded-3xl p-8 bg-gradient-to-br ${colors.gradient} border ${colors.border} ${
                    isPopular ? 'shadow-2xl shadow-sky-200 scale-105 z-10' : 'shadow-lg'
                  } hover:shadow-xl transition-all duration-300`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-lg">
                        ⭐ Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`${colors.badge} inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4`}>
                    {plan.name}
                  </div>

                  <div className="mb-6">
                    <span className={`text-4xl font-extrabold ${isPopular ? 'text-white' : 'text-slate-900'}`}>
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                    <span className={`text-sm ${isPopular ? 'text-sky-100' : 'text-slate-500'}`}>/year</span>
                  </div>

                  <p className={`text-sm mb-6 leading-relaxed ${isPopular ? 'text-sky-100' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className={`flex items-start gap-2 text-sm ${isPopular ? 'text-white' : 'text-slate-700'}`}>
                        <Check size={16} className={`mt-0.5 flex-shrink-0 ${isPopular ? 'text-sky-200' : 'text-sky-500'}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isPopular
                        ? 'bg-white text-sky-600 hover:bg-sky-50 hover:shadow-lg'
                        : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-200'
                    }`}
                  >
                    Start Free Trial
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

/* ─── Testimonials Section ─── */
const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'AquaCare has been amazing! Their technician comes exactly on schedule. My RO has never worked better. The online dashboard is so convenient.',
    avatar: 'PS',
  },
  {
    name: 'Rajesh Kumar',
    location: 'Delhi',
    rating: 5,
    text: 'Switched from another provider and the difference is night and day. Genuine parts, professional service, and the auto-reminders are a lifesaver!',
    avatar: 'RK',
  },
  {
    name: 'Anita Patel',
    location: 'Ahmedabad',
    rating: 5,
    text: 'Best RO service company I\'ve used. The emergency service within 24 hours actually works! Highly recommend the Standard plan.',
    avatar: 'AP',
  },
];

const Testimonials = () => (
  <section id="testimonials" className="py-24 bg-white">
    <div className="container mx-auto px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
        className="text-center mb-16"
      >
        <motion.span variants={fadeUp} className="text-sky-600 font-semibold text-sm uppercase tracking-widest">
          Testimonials
        </motion.span>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
          Loved by{' '}
          <span className="text-sky-600">Thousands</span>
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.name}
            variants={fadeUp}
            className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {t.avatar}
              </div>
              <div>
                <div className="font-semibold text-slate-800">{t.name}</div>
                <div className="text-sm text-slate-500 flex items-center gap-1">
                  <MapPin size={12} />
                  {t.location}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ─── CTA Section ─── */
const CTA = () => (
  <section className="py-24 bg-gradient-to-r from-sky-600 to-blue-700 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
    </div>
    <div className="container mx-auto px-4 relative z-10 text-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-white mb-6">
          Ready for Pure, Safe Water?
        </motion.h2>
        <motion.p variants={fadeUp} className="text-sky-100 text-lg max-w-2xl mx-auto mb-10">
          Join 10,000+ families who trust AquaCare for their water purifier maintenance.
          Start your free trial — no credit card required.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-sky-600 text-lg px-10 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-sky-900/20 transition-all duration-300 hover:-translate-y-1"
          >
            Start 14-Day Free Trial
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

/* ─── Footer ─── */
const Footer = () => (
  <footer id="contact" className="bg-slate-900 text-slate-300 pt-16 pb-8">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Droplets size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">AquaCare</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            India&apos;s most trusted RO water purifier servicing company. Quality service, genuine parts, happy customers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" className="hover:text-sky-400 transition-colors">Features</a></li>
            <li><a href="#plans" className="hover:text-sky-400 transition-colors">AMC Plans</a></li>
            <li><a href="#testimonials" className="hover:text-sky-400 transition-colors">Reviews</a></li>
            <li><Link to="/login" className="hover:text-sky-400 transition-colors">Login</Link></li>
            <li><Link to="/register" className="hover:text-sky-400 transition-colors">Register</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li>RO Installation</li>
            <li>Annual Maintenance</li>
            <li>Filter Replacement</li>
            <li>Membrane Replacement</li>
            <li>Water Quality Testing</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-sky-400" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-sky-400" />
              support@aquacare.com
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-sky-400 mt-0.5" />
              123 Water Street, Andheri West, Mumbai 400058
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} AquaCare. All rights reserved.
      </div>
    </div>
  </footer>
);

/* ─── Landing Page (composed) ─── */
const Landing = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Plans />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;
