'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MdVerifiedUser, MdWorkspacePremium } from 'react-icons/md';
import { MdSupportAgent } from 'react-icons/md';
import { MdSecurity } from 'react-icons/md';

export default function LandingPage() {
  const [trustedEmployers, setTrustedEmployers] = useState<number | null>(null);
  const [recentJob, setRecentJob] = useState<{
    company: string;
    title: string;
    applicants: number;
    closesIn: string;
  } | null>(null);

  useEffect(() => {
    // Fetch trusted employers (admins)
    fetch('/api/admin-count')
      .then((res) => res.json())
      .then((data) => setTrustedEmployers(data.count))
      .catch(() => setTrustedEmployers(null));

    // Fetch most recent job posting
    fetch('/api/recent-job')
      .then((res) => res.json())
      .then((data) => setRecentJob(data))
      .catch(() => setRecentJob(null));
  }, []);
  return (
    <main className="min-h-screen bg-[#eaf1ef] font-inter flex flex-col items-center justify-center relative overflow-x-hidden">
      {/* Header */}
      <motion.header
        className="w-full px-4 md:px-0 py-6 flex justify-center bg-transparent"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="w-full max-w-7xl flex items-center justify-between rounded-2xl shadow-none">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          >
            <span className="font-extrabold text-2xl tracking-tight text-[#222]">NEXEL</span>
          </motion.div>
          <motion.nav
            className="hidden md:flex gap-10 text-[#222] font-medium text-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            <a
              href="/dashboard/student"
              className="hover:text-[#1e7d6b] transition cursor-pointer inline-block"
            >
              For Students
            </a>
            <a
              href="/dashboard/admin"
              className="hover:text-[#1e7d6b] transition cursor-pointer inline-block"
            >
              For Admins
            </a>
            <a
              href="/about"
              className="hover:text-[#1e7d6b] transition cursor-pointer inline-block"
            >
              About
            </a>
            <a
              href="/solutions"
              className="hover:text-[#1e7d6b] transition cursor-pointer inline-block"
            >
              Solutions
            </a>
          </motion.nav>
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          >
            <a
              href="/auth?tab=login"
              className="px-7 py-2 rounded-full border border-[#1e7d6b] text-[#1e7d6b] font-semibold shadow hover:bg-[#1e7d6b]/10 transition-all duration-200 cursor-pointer"
            >
              Log In
            </a>
            <a
              href="/auth?tab=signup"
              className="px-7 py-2 rounded-full bg-[#1e7d6b] text-white font-semibold shadow hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              Join us
            </a>
          </motion.div>
        </div>
      </motion.header>

      <motion.div
        className="absolute inset-x-0 top-0 h-[22vh] flex items-start justify-center pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <span
          className="w-full text-center font-extrabold text-[13vw] md:text-[9vw] tracking-wider text-[#193c35] opacity-20 select-none mt-20"
          style={{
            letterSpacing: '0.05em',
            fontFamily: "'Montserrat', Inter, sans-serif",
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          WORKSPACE
        </span>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-0 pt-8 pb-0 md:pb-8 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        {/* Left: Text and Search */}
        <motion.div
          className="flex-1 flex flex-col gap-6 md:gap-10 mt-32"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center bg-white rounded-full px-6 py-3 w-full max-w-lg shadow border border-[#dbe7e3] mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <svg
              className="w-5 h-5 text-[#b7c7c2] mr-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for jobs, companies, or skills..."
              className="bg-transparent outline-none border-none w-full text-[#222] text-lg"
            />
            <button className="ml-3 px-4 py-2 bg-[#1e7d6b] text-white rounded-full font-semibold text-sm">
              Search
            </button>
          </motion.div>
          <motion.div
            className="flex gap-2 flex-wrap mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <span className="text-[#222] text-sm">Popular searches:</span>
            {['Frontend Developer', 'Data Analyst', 'UI/UX Designer', 'Marketing', 'Remote'].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-[#eaf1ef] border border-[#dbe7e3] text-[#1e7d6b] font-medium text-xs cursor-pointer hover:bg-[#dbe7e3] transition"
                >
                  {tag}
                </span>
              ),
            )}
          </motion.div>
          <motion.p
            className="text-[#222] text-base font-medium mb-4 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            Discover your next opportunity. Search and apply to jobs from top companies, or find the
            perfect candidate for your team—all in one place.
          </motion.p>
          {/* Trusted Employers Card */}
          <motion.div
            className="backdrop-blur-md bg-[rgba(20,40,70,0.75)] border border-[#22334a] rounded-2xl px-10 py-7 flex items-center gap-8 shadow max-w-md w-full"
            style={{
              boxShadow: '0 8px 32px 0 rgba(20, 40, 70, 0.25)',
              border: '1px solid rgba(34,51,74,0.28)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-[#b7c7c2] flex items-center justify-center overflow-hidden"
                >
                  <Image
                    src={`/images/user${i}.png`}
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div>
              <div className="text-[#fff] font-semibold text-lg">Trusted Employers</div>
              <div className="text-[#fff] text-sm">
                {trustedEmployers !== null ? `${trustedEmployers}+ Companies Hiring` : 'Loading...'}
              </div>
            </div>
          </motion.div>
        </motion.div>
        {/* Right: Hero Image and Card */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center relative mt-12 md:mt-0"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="z-10 -mt-24 pointer-events-none"
          >
            <Image
              src="/images/hero.png"
              alt="Job portal hero"
              width={1300}
              height={1300}
              className="object-contain"
              priority
            />
          </motion.div>
          {/* Floating Card */}
          <motion.div
            className="absolute bottom-8 right-0 backdrop-blur-md bg-[rgba(30,60,90,0.35)] border border-[#3a4a5a] rounded-2xl px-6 py-4 shadow flex items-center gap-4 min-w-[260px] z-20 pointer-events-none"
            style={{
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
              border: '1px solid rgba(58,74,90,0.18)',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
          >
            <div className="w-10 h-10 rounded-full bg-[#eaf1ef] flex items-center justify-center text-[#1e7d6b] font-bold text-lg">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M12 16v-4M12 8h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="text-[#fff] font-semibold">
                {recentJob?.company ? `@${recentJob.company}` : '@acme_corp'}
              </div>
              <div className="text-[#fff] text-s">
                {recentJob?.title ? `Hiring: ${recentJob.title}` : 'Hiring: React Developer'}
              </div>
              <div className="text-[#fff] text-s mt-1">
                {recentJob?.applicants !== undefined
                  ? `${recentJob.applicants} applicants`
                  : '45 applicants'}
              </div>
              <div className="text-[#fff] text-xs">
                {recentJob?.closesIn ? `Closes in ${recentJob.closesIn}` : 'Closes in 3 days'}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Popular Job Categories */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-0 mt-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#222] mb-6 tracking-tight">
          POPULAR JOB CATEGORIES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: 'Software Development',
              tags: ['Frontend', 'Backend', 'Full Stack', 'Mobile Apps'],
              img: '/images/job-software.png',
            },
            {
              title: 'Data & Analytics',
              tags: ['Data Science', 'Data Analysis', 'Machine Learning', 'BI'],
              img: '/images/job-data.png',
            },
            {
              title: 'Design & Creative',
              tags: ['UI/UX', 'Graphic Design', 'Product Design', 'Animation'],
              img: '/images/job-design.png',
            },
            {
              title: 'Marketing & Sales',
              tags: ['Digital Marketing', 'SEO', 'Content', 'Sales'],
              img: '/images/job-marketing.png',
            },
          ].map((category, idx) => (
            <motion.div
              key={category.title}
              className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-4 flex flex-col gap-3"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <div className="w-full h-36 rounded-xl overflow-hidden mb-2">
                <Image
                  src={category.img}
                  alt={category.title}
                  width={300}
                  height={144}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="font-bold text-lg text-[#222]">{category.title}</div>
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#eaf1ef] text-[#1e7d6b] px-3 py-1 rounded-full text-xs font-medium border border-[#dbe7e3]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button className="ml-auto mt-2 w-8 h-8 rounded-full bg-[#1e7d6b] flex items-center justify-center text-white">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Outstanding Talent Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-0 mt-20 flex flex-col md:flex-row items-center gap-10">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#222] mb-4 tracking-tight">
            FIND OUTSTANDING TALENT.
          </h2>
          <p className="text-[#222] text-base font-medium mb-4">
            Connect with top professionals ready to bring your projects to life. Our platform
            features skilled candidates across every industry, ensuring you find the perfect match
            for your company&apos;s needs.
          </p>
        </motion.div>
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/job-success.png"
            alt="Outstanding Talent"
            width={400}
            height={300}
            className="rounded-2xl object-cover"
          />
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-0 mt-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#222] mb-6 tracking-tight">
          WHY CHOOSE US?
        </h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6 flex flex-col items-center text-center">
            <MdVerifiedUser
              size={60}
              className="mb-3 text-[#1e7d6b] rounded-full border-2 border-[#1e7d6b]"
              style={{ padding: 8, background: 'white' }}
            />
            <div className="font-bold text-lg text-[#222] mb-2">VERIFIED EMPLOYERS</div>
            <p className="text-[#222] text-sm">
              All companies and recruiters are thoroughly vetted to ensure genuine job opportunities
              and a safe hiring process.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6 flex flex-col items-center text-center">
            <MdSupportAgent
              size={60}
              className="mb-3 text-[#1e7d6b] rounded-full border-2 border-[#1e7d6b]"
              style={{ padding: 8, background: 'white' }}
            />
            <div className="font-bold text-lg text-[#222] mb-2">24/7 SUPPORT</div>
            <p className="text-[#222] text-sm">
              Our dedicated support team is always available to help you with your job search or
              hiring needs.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6 flex flex-col items-center text-center">
            <MdSecurity
              size={60}
              className="mb-3 text-[#1e7d6b] rounded-full border-2 border-[#1e7d6b]"
              style={{ padding: 8, background: 'white' }}
            />
            <div className="font-bold text-lg text-[#222] mb-2">SECURE PLATFORM</div>
            <p className="text-[#222] text-sm">
              Your data and applications are protected with industry-leading security and privacy
              standards.
            </p>
          </div>
        </motion.div>

        {/* Infinite Horizontal Scrolling Features */}
        <div className="relative mt-12 overflow-x-hidden">
          <motion.div
            className="flex gap-6 w-max animate-scroll-infinite"
            initial={{ x: 0 }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              duration: 18,
              ease: 'linear',
            }}
          >
            {[
              {
                img: '/images/feature-job-alerts.png',
                title: 'Instant Job Alerts',
                desc: 'Get notified about new jobs matching your profile instantly.',
                imgDesc: 'A phone showing job notifications or a bell icon with job offers.',
              },
              {
                img: '/images/feature-networking.png',
                title: 'Professional Networking',
                desc: 'Connect with top employers and industry leaders.',
                imgDesc: 'People shaking hands or a networking event.',
              },
              {
                img: '/images/feature-remote.png',
                title: 'Remote & Hybrid Jobs',
                desc: 'Find flexible work options that fit your lifestyle.',
                imgDesc: 'A person working on a laptop from home or a coffee shop.',
              },
              {
                img: '/images/feature-growth.png',
                title: 'Career Growth Tools',
                desc: 'Access resume builders, interview tips, and more.',
                imgDesc: 'A resume, growth chart, or someone climbing stairs.',
              },
              {
                img: '/images/feature-trust.png',
                title: 'Trusted by Thousands',
                desc: 'Join a platform trusted by job seekers and employers worldwide.',
                imgDesc: 'A group of happy professionals or a trust badge.',
              },
            ]
              .concat([
                // Duplicate for seamless infinite scroll
                {
                  img: '/images/feature-job-alerts.png',
                  title: 'Instant Job Alerts',
                  desc: 'Get notified about new jobs matching your profile instantly.',
                  imgDesc: 'A phone showing job notifications or a bell icon with job offers.',
                },
                {
                  img: '/images/feature-networking.png',
                  title: 'Professional Networking',
                  desc: 'Connect with top employers and industry leaders.',
                  imgDesc: 'People shaking hands or a networking event.',
                },
                {
                  img: '/images/feature-remote.png',
                  title: 'Remote & Hybrid Jobs',
                  desc: 'Find flexible work options that fit your lifestyle.',
                  imgDesc: 'A person working on a laptop from home or a coffee shop.',
                },
                {
                  img: '/images/feature-growth.png',
                  title: 'Career Growth Tools',
                  desc: 'Access resume builders, interview tips, and more.',
                  imgDesc: 'A resume, growth chart, or someone climbing stairs.',
                },
                {
                  img: '/images/feature-trust.png',
                  title: 'Trusted by Thousands',
                  desc: 'Join a platform trusted by job seekers and employers worldwide.',
                  imgDesc: 'A group of happy professionals or a trust badge.',
                },
              ])
              .map((feature, idx) => (
                <div
                  key={idx}
                  className="min-w-[260px] bg-white/80 border border-[#dbe7e3] rounded-2xl shadow p-5 flex flex-col items-center text-center mx-2"
                >
                  <div className="w-full h-40 rounded-xl overflow-hidden mb-2 flex items-center justify-center">
                    <Image
                      src={feature.img}
                      alt={feature.imgDesc}
                      width={120}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="font-bold text-[#1e7d6b] mb-1">{feature.title}</div>
                  <div className="text-xs text-[#222]">{feature.desc}</div>
                </div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* What Our Customers Say */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-0 mt-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#222] mb-6 tracking-tight">
          WHAT OUR CUSTOMERS SAY
        </h2>
        <motion.div
          className="bg-[#eaf1ef] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <div className="flex-1 flex flex-col gap-4">
            <p className="text-[#222] text-base font-medium">
              &quot;We found our lead developer through this portal and the process was seamless.
              The platform made it easy to connect, communicate, and hire top talent. Highly
              recommended for any company looking to grow their team efficiently.&quot;
            </p>
            <div className="flex items-center gap-3">
              <Image
                src="/images/user-review-job.png"
                alt="Customer"
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <div className="font-bold text-[#222]">Alicia Gomez</div>
                <div className="text-xs text-[#1e7d6b]">HR Manager, TechNova</div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <MdWorkspacePremium
              size={60}
              className="mb-3 text-[#1e7d6b] rounded-full border-2 border-[#1e7d6b] bg-white"
              style={{ padding: 8 }}
            />
            <div className="font-bold text-lg text-[#222] mb-2">TOP TALENT GUARANTEE</div>
          </div>
        </motion.div>
      </section>

      {/* Experienced Professionals */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-0 mt-20 mb-16">
        <motion.div
          className="flex flex-col md:flex-row items-center gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          {/* Stacked Photos */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-[500px] h-[200px] flex items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${(i - 1) * 50}px`, // 50% overlap for 320px images
                    zIndex: 10 - i,
                  }}
                >
                  <motion.div
                    whileHover={{
                      y: -20,
                      scale: 1.15,
                      zIndex: 20,
                      boxShadow: '0 8px 32px 0 rgba(30,60,90,0.18)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-[100px] h-[100px] rounded-full border-2 border-white bg-[#b7c7c2] flex items-center justify-center overflow-hidden shadow cursor-pointer"
                    style={{ zIndex: 10 - i }}
                  >
                    <Image
                      src={`/images/professional${i}.png`}
                      alt={`Professional user ${i}`}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#222]">
              EXPERIENCED PROFESSIONALS
            </h2>
            <p className="text-[#222] text-base font-medium">
              Our platform connects you with experienced professionals from diverse
              industries—engineers, designers, analysts, marketers, and more—ready to help your
              business grow.
            </p>
            <button className="mt-2 px-7 py-2 rounded-full bg-[#1e7d6b] text-white font-semibold shadow hover:scale-105 transition-all duration-200">
              Start Hiring
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full relative bg-[#10241c] py-12 border-t border-[#1e7d6b]/40 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center z-0 opacity-70"
        >
          <div className="w-[480px] h-[180px] rounded-full blur-3xl opacity-40 bg-gradient-to-r from-[#1e7d6b] via-[#2fa97c] to-[#1e7d6b]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-0 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-extrabold text-2xl tracking-tight text-white">NEXEL</span>
            <span className="text-[#b7c7c2] text-sm max-w-xs">
              The modern job portal connecting top talent with leading companies. Discover, connect,
              and grow your career or team.
            </span>
            <div className="flex gap-3 mt-3">
              <a href="#" aria-label="Facebook" className="transition hover:scale-110">
                <span className="w-8 h-8 rounded-full bg-white/10 border border-[#1e7d6b] flex items-center justify-center text-[#1e7d6b] font-bold text-lg backdrop-blur-md shadow hover:bg-[#1e7d6b] hover:text-white transition">
                  f
                </span>
              </a>
              <a href="#" aria-label="Twitter" className="transition hover:scale-110">
                <span className="w-8 h-8 rounded-full bg-white/10 border border-[#1e7d6b] flex items-center justify-center text-[#1e7d6b] font-bold text-lg backdrop-blur-md shadow hover:bg-[#1e7d6b] hover:text-white transition">
                  t
                </span>
              </a>
              <a href="#" aria-label="LinkedIn" className="transition hover:scale-110">
                <span className="w-8 h-8 rounded-full bg-white/10 border border-[#1e7d6b] flex items-center justify-center text-[#1e7d6b] font-bold text-lg backdrop-blur-md shadow hover:bg-[#1e7d6b] hover:text-white transition">
                  in
                </span>
              </a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-10 text-[#eaf1ef] text-sm">
            <div>
              <div className="font-bold mb-2 text-[#b7c7c2]">PRODUCT</div>
              <a href="#" className="block hover:text-[#2fa97c] transition">
                About
              </a>
              <a href="#" className="block hover:text-[#2fa97c] transition">
                Team
              </a>
              <a href="#" className="block hover:text-[#2fa97c] transition">
                Careers
              </a>
            </div>
            <div>
              <div className="font-bold mb-2 text-[#b7c7c2]">SUPPORT</div>
              <a href="#" className="block hover:text-[#2fa97c] transition">
                How it Works
              </a>
              <a href="#" className="block hover:text-[#2fa97c] transition">
                Trust & Safety
              </a>
              <a href="#" className="block hover:text-[#2fa97c] transition">
                Help Centre
              </a>
            </div>
            <div>
              <div className="font-bold mb-2 text-[#b7c7c2]">RESOURCES</div>
              <a href="#" className="block hover:text-[#2fa97c] transition">
                Customer Stories
              </a>
              <a href="#" className="block hover:text-[#2fa97c] transition">
                Cost Calculator
              </a>
              <a href="#" className="block hover:text-[#2fa97c] transition">
                Startup Cities
              </a>
            </div>
            <div>
              <div className="font-bold mb-2 text-[#b7c7c2]">FREELANCE</div>
              <a href="#" className="block hover:text-[#2fa97c] transition">
                Services
              </a>
              <a href="#" className="block hover:text-[#2fa97c] transition">
                Services by Country
              </a>
              <a href="#" className="block hover:text-[#2fa97c] transition">
                Skills
              </a>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-center text-[#b7c7c2] text-xs mt-8">
          © 2025 Nexel Pvt. Ltd. &nbsp; | &nbsp; Terms &nbsp; Privacy &nbsp; Sitemap &nbsp; Company
        </div>
      </footer>
    </main>
  );
}
