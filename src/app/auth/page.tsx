'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiShield } from 'react-icons/fi';
import { supabase } from '@/lib/supabaseClient';
import { signUpWithEmail, signInWithEmail, sendPasswordReset } from '@/lib/auth';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');

  return (
    <div className="min-h-screen flex bg-[#0E1012] font-inter relative overflow-hidden">
      {/* Left Side */}
      <img
      src="/light-rays.png"
      alt=""
      className="absolute top-0 left-0 w-[700px] h-[400px] opacity-15 pointer-events-none select-none z-0"
      draggable={false}
      style={{ objectFit: 'cover' }}
    />
      
      <div className="hidden md:flex w-3/5 flex-col justify-center px-16 relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-5xl font-bold text-[#E6E6E6] mb-6 tracking-tight">
            LET’S <span className="text-[#00E1A9]">CONNECT</span>
            <br />
            WITH <span className="text-[#A1A1A1]">NEXEL</span>
          </h1>
          <p className="text-[#A1A1A1] text-lg mb-10 font-medium">
            Seamlessly Enhance The Future Through Nexel Technology
          </p>
        </div>
        <span className="absolute bottom-0 left-12 text-[8rem] font-extrabold text-[#2C2F32] opacity-20 select-none pointer-events-none">
          NEXEL
        </span>
      </div>
      {/* Right Side (Form) */}
      <div className="w-full md:w-2/5 flex items-center justify-center bg-[#0E1012]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-md mx-6 p-8 rounded-2xl bg-[#181B1E]/80 backdrop-blur-lg shadow-2xl border border-[#2C2F32] relative"
          style={{
            boxShadow:
              '0 4px 32px 0 rgba(0,0,0,0.45), inset 0 1.5px 8px 0 #23272f, 0 1.5px 8px 0 #00E1A933',
          }}
        >
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold text-[#E6E6E6] mb-8 text-center tracking-tight">
            {activeTab === 'login'
              ? 'Welcome Back'
              : activeTab === 'signup'
              ? 'Create Account'
              : 'Reset Password'}
          </h2>
          {/* Tabs */}
          <div className="flex mb-8 space-x-2 justify-center">
            <TabButton
              active={activeTab === 'login'}
              onClick={() => setActiveTab('login')}
            >
              Email Account
            </TabButton>
            <TabButton
              active={activeTab === 'signup'}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </TabButton>
          </div>
          {/* Forms */}
          {activeTab === 'login' && (
                <LoginForm
                    onForgot={() => setActiveTab('forgot')}
                    setActiveTab={setActiveTab}
                />
                )}
          {activeTab === 'signup' && <SignupForm />}
          {activeTab === 'forgot' && <ForgotForm onBack={() => setActiveTab('login')} />}
          <div className="mt-8 text-center text-[#A1A1A1] text-xs">
            Copyright © {new Date().getFullYear()} Nexel. All Rights Reserved.
          </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`px-4 py-2 rounded-full font-semibold transition-all text-sm relative
        ${active
          ? 'bg-[#008060] text-white'
          : 'bg-transparent text-[#A1A1A1] hover:text-[#00B386]'
        }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Login Form
function LoginForm({ onForgot, setActiveTab }: { onForgot: () => void; setActiveTab: (tab: 'login' | 'signup' | 'forgot') => void }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signInWithEmail(form);
    setLoading(false);

    if (error) setError(error.message || 'Invalid credentials');
    // else: redirect or reload as needed
  };

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      <FloatingInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" icon={<FiMail />} placeholder=" " />
      <FloatingInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} autoComplete="current-password" icon={<FiLock />} placeholder=" " />
      <div className="flex justify-between items-center">
        <button type="button" className="text-[#3AF0C0] text-xs hover:underline" onClick={onForgot}>Forgot Password?</button>
      </div>
      <AccentButton>{loading ? 'Signing In...' : 'Sign In Now'}</AccentButton>
      {error && <div className="text-red-500 text-xs text-center">{error}</div>}
      <div className="text-center text-[#A1A1A1] text-xs mt-2">
        Don&apos;t have access yet?{' '}
        <span className="text-[#3AF0C0] hover:underline cursor-pointer" onClick={() => setActiveTab('signup')}>Sign Up</span>
      </div>
    </form>
  );
}

// Signup Form
function SignupForm() {
  const [role, setRole] = useState<'student' | 'admin'>();
  const [college, setCollege] = useState('');
  const [colleges, setColleges] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchColleges() {
      const { data, error } = await supabase.from('colleges').select('id, name').order('name');
      console.log('Colleges:', data, error);
      if (!error && data) setColleges(data);
    }
    fetchColleges();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await signUpWithEmail({
      name: form.name,
      email: form.email,
      password: form.password,
      role: role!,
      college_id: role === 'student' ? college : null,
});

    setLoading(false);

    if (error) {
      setError(error.message || 'Something went wrong.');
    } else {
      setMessage('Check your email for a confirmation link!');
      setForm({ name: '', email: '', password: '' });
      setRole(undefined);
      setCollege('');
    }
  };

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      <FloatingInput label="Name" type="text" name="name" value={form.name} onChange={handleChange} autoComplete="name" placeholder=" " />
      <FloatingInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" icon={<FiMail />} placeholder=" " />
      <FloatingInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} autoComplete="new-password" icon={<FiLock />} placeholder=" " />

      {/* Role Selector */}
      <div>
        <label className="block text-xs font-medium text-[#A1A1A1] mb-2">Role</label>
        <div className="flex gap-4">
          <RoleCard icon={<FiUser size={20} />} label="Student" active={role === 'student'} onClick={() => setRole('student')} />
          <RoleCard icon={<FiShield size={20} />} label="Admin" active={role === 'admin'} onClick={() => setRole('admin')} />
        </div>
      </div>

      {/* College Selector */}
      {role === 'student' && (
        <div>
            <label className="block text-xs font-medium text-[#A1A1A1] mb-2">College</label>
            <div className="relative">
            <select
                name="college_id"
                value={college}
                onChange={e => setCollege(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#181B1E]/70 border border-[#2C2F32] text-[#E6E6E6] focus:ring-2 focus:ring-[#00E1A9] focus:border-[#00E1A9] transition-all shadow-inner appearance-none"
            >
                <option value="">Select your college</option>
                {colleges.map(col => (
                <option key={col.id} value={col.id}>{col.name}</option>
                ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1A1] pointer-events-none">&#9662;</span>
            </div>
        </div>
      )}

      <AccentButton>{loading ? 'Signing Up...' : 'Sign Up'}</AccentButton>
      {message && <div className="text-green-400 text-xs text-center">{message}</div>}
      {error && <div className="text-red-500 text-xs text-center">{error}</div>}
    </form>
  );
}

function RoleCard({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-6 py-3 rounded-xl border transition-all
        ${active
          ? 'border-[#00E1A9] bg-[#181B1E]/80 shadow-[0_0_16px_0_#00E1A955]'
          : 'border-[#2C2F32] bg-[#181B1E]/60 hover:border-[#00E1A9]/60'
        }`}
      style={{
        boxShadow: active
          ? '0 0 16px 0 #00E1A955, 0 1.5px 8px 0 #00E1A933'
          : undefined,
      }}
    >
      <span className={`mb-1 ${active ? 'text-[#00E1A9]' : 'text-[#A1A1A1]'}`}>{icon}</span>
      <span className={`text-sm font-semibold ${active ? 'text-[#00E1A9]' : 'text-[#A1A1A1]'}`}>{label}</span>
    </button>
  );
}

// Forgot Password Form
function ForgotForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await sendPasswordReset(email);
    setLoading(false);

    if (error) setError(error.message || 'Something went wrong.');
    else setMessage('Check your email for a reset link!');
  };

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      <FloatingInput label="Email" type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" icon={<FiMail />} placeholder=" " />
      <AccentButton>{loading ? 'Sending...' : 'Send Reset Link'}</AccentButton>
      {message && <div className="text-green-400 text-xs text-center">{message}</div>}
      {error && <div className="text-red-500 text-xs text-center">{error}</div>}
      <div className="text-center text-[#A1A1A1] text-xs mt-2">
        <span className="text-[#3AF0C0] hover:underline cursor-pointer" onClick={onBack}>Back to Login</span>
      </div>
    </form>
  );
}

// Accent Button
function AccentButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full py-2 mt-2 rounded-full font-semibold text-[15px] bg-gradient-to-r from-[#00E1A9] to-[#3AF0C0] hover:from-[#00C89D] hover:to-[#3AF0C0] text-[#181B1E] shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00E1A9] focus:ring-offset-2"
      style={{
        boxShadow: '0 2px 16px 0 #00E1A955, 0 1.5px 8px 0 #00E1A933',
      }}
    >
      {children}
    </button>
  );
}

function FloatingInput({
  label,
  icon,
  value,
  onChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon?: React.ReactNode }) {
  const [focus, setFocus] = useState(false);

  return (
    <div className="relative">
      <div
        className={`flex items-center bg-[#181B1E]/70 border border-[#2C2F32] rounded-xl px-4 py-3 transition-all duration-200
          ${focus ? 'border-[#00E1A9]' : ''}
        `}
      >
        {icon && (
          <span className="absolute left-4 text-[#A1A1A1] opacity-60 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          {...props}
          value={value}
          onChange={onChange}
          className="bg-transparent outline-none border-none w-full text-[#E6E6E6] pl-10 text-[16px] font-medium"
          required
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        <label
          className={`absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200
            text-[15px] font-medium opacity-60
            ${focus || value
              ? 'text-[#00E1A9] -top-3 left-10 text-xs bg-[#181B1E] px-1 opacity-100'
              : 'text-[#A1A1A1] top-1/2'
            }
          `}
        >
          {label}
        </label>
      </div>
    </div>
  );
}