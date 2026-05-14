'use client'

import { useState } from 'react'
import { login, signup } from '../home/actions'
import { Loader2, Lock, Store, User, Building2, ArrowRight, Smartphone, Mail } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const [userType, setUserType] = useState<'customer' | 'retailer'>('customer')
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setMessage(null)

        try {
            if (userType === 'customer') {
                const phone = formData.get('phone') as string
                if (!phone) throw new Error('Phone number is required')

                const cleanPhone = phone.replace(/\D/g, '')
                if (cleanPhone.length < 10) throw new Error('Invalid phone number')

                const email = `${cleanPhone}@internal.app`
                formData.set('email', email)
            } else {
                const emailInput = formData.get('email') as string
                if (!emailInput) throw new Error('Email is required')
            }

            formData.set('role', userType)

            if (isLogin) {
                const result = await login(formData)
                if (result?.error) {
                    let errorMsg = result.error
                    if (result.error.includes('Invalid login credentials') || result.error.includes('Invalid credentials')) {
                        errorMsg = 'Invalid credentials. If you just signed up, please verify your email.'
                    }
                    setMessage({ type: 'error', text: errorMsg })
                }
            } else {
                const result = await signup(formData)
                if (result?.error) {
                    setMessage({ type: 'error', text: result.error })
                } else if (result?.success && result?.message) {
                    setMessage({ type: 'success', text: result.message })
                }
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            setMessage({ type: 'error', text: errorMessage })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-blue-500/30 flex flex-col items-center justify-center p-6 relative overflow-hidden">
             {/* Dynamic Background Effects */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />
                 <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
                 <div className="absolute top-[40%] right-[40%] w-[20%] h-[20%] bg-emerald-500/5 rounded-full blur-[100px]" />
             </div>

             <div className="w-full max-w-md perspective-1000 relative z-20 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <Link href="/home" className="inline-flex items-center gap-2 mb-8 text-zinc-400 hover:text-white transition-colors group text-sm font-medium">
                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                {/* Glow Effect behind card */}
                <div className="absolute inset-0 top-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur-2xl opacity-20 animate-pulse-slow pointer-events-none"></div>

                <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 lg:p-8 ring-1 ring-white/5 relative group transition-all duration-500">
                     {/* Decoration */}
                     <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                     {/* Login Header inside card */}
                     <div className="mb-8 text-center">
                         <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                         </div>
                         <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
                         <p className="text-sm text-zinc-400">{isLogin ? 'Access your intelligent dashboard' : 'Join RetailIntel to transform your business'}</p>
                     </div>

                     {/* User Type Toggle */}
                     <div className="grid grid-cols-2 p-1.5 border border-zinc-800/50 bg-zinc-950/50 rounded-xl mb-6">
                         <button
                             onClick={() => setUserType('customer')}
                             type="button"
                             className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${userType === 'customer'
                                 ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10'
                                 : 'text-zinc-500 hover:text-zinc-300'
                                 }`}
                         >
                             <User className="w-4 h-4" />
                             Customer
                         </button>
                         <button
                             onClick={() => setUserType('retailer')}
                             type="button"
                             className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${userType === 'retailer'
                                 ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10'
                                 : 'text-zinc-500 hover:text-zinc-300'
                                 }`}
                         >
                             <Store className="w-4 h-4" />
                             Retailer
                         </button>
                     </div>

                     {/* Auth Mode Toggle */}
                     <div className="flex bg-zinc-950/30 rounded-lg p-1 mb-6 border border-zinc-800/50">
                         <button
                             onClick={() => setIsLogin(true)}
                             type="button"
                             className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-300 ${isLogin
                                 ? 'bg-blue-600/10 text-blue-400'
                                 : 'text-zinc-600 hover:text-zinc-400'
                                 }`}
                         >
                             Log In
                         </button>
                         <button
                             onClick={() => setIsLogin(false)}
                             type="button"
                             className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-300 ${!isLogin
                                 ? 'bg-purple-600/10 text-purple-400'
                                 : 'text-zinc-600 hover:text-zinc-400'
                                 }`}
                         >
                             Sign Up
                         </button>
                     </div>

                     <form action={handleSubmit} className="space-y-4">
                         <div className="space-y-4 min-h-[140px]">
                             {userType === 'customer' ? (
                                 <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                                     {!isLogin && (
                                         <div className="group">
                                             <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Full Name</label>
                                             <div className="relative">
                                                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                                 <input
                                                     name="full_name"
                                                     type="text"
                                                     required
                                                     placeholder="John Doe"
                                                     className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                                 />
                                             </div>
                                         </div>
                                     )}

                                     <div className="group">
                                         <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Phone Number</label>
                                         <div className="relative">
                                             <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                             <input
                                                 name="phone"
                                                 type="tel"
                                                 required
                                                 placeholder="123 456 7890"
                                                 className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                                             />
                                         </div>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                     <div className="group">
                                         <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Email Address</label>
                                         <div className="relative">
                                             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                                             <input
                                                 name="email"
                                                 type="email"
                                                 required
                                                 placeholder="retailer@company.com"
                                                 className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                                             />
                                         </div>
                                     </div>

                                     {!isLogin && (
                                         <>
                                             <div className="group animate-in fade-in slide-in-from-top-2 duration-300">
                                                 <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Organization Name</label>
                                                 <div className="relative">
                                                     <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                                                     <input
                                                         name="org_name"
                                                         type="text"
                                                         required={!isLogin}
                                                         placeholder="Company Name"
                                                         className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                                                     />
                                                 </div>
                                             </div>

                                             <div className="group animate-in fade-in slide-in-from-top-2 duration-300 delay-75">
                                                 <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Address</label>
                                                 <div className="relative">
                                                     <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                                                     <input
                                                         name="org_address"
                                                         type="text"
                                                         required={!isLogin}
                                                         placeholder="Business Address"
                                                         className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                                                     />
                                                 </div>
                                             </div>
                                         </>
                                     )}
                                 </div>
                             )}

                             <div className="group">
                                 <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Password</label>
                                 <div className="relative">
                                     <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors ${userType === 'customer' ? 'group-focus-within:text-blue-400' : 'group-focus-within:text-purple-400'}`} />
                                     <input
                                         name="password"
                                         type="password"
                                         required
                                         minLength={6}
                                         placeholder="••••••••"
                                         className={`w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 transition-all ${userType === 'customer' ? 'focus:ring-blue-500/20 focus:border-blue-500/50' : 'focus:ring-purple-500/20 focus:border-purple-500/50'}`}
                                     />
                                 </div>
                             </div>
                         </div>

                         {message && (
                             <div className={`p-3 rounded-lg text-xs flex items-center gap-2 animate-in slide-in-from-top-2 ${message.type === 'error'
                                 ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                 : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                 }`}>
                                 <div className={`w-1.5 h-1.5 rounded-full ${message.type === 'error' ? 'bg-red-400' : 'bg-green-400'}`} />
                                 {message.text}
                             </div>
                         )}

                         <button
                             type="submit"
                             disabled={loading}
                             className={`w-full font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-4 text-white overflow-hidden relative group/btn ${userType === 'customer'
                                 ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-blue-900/20'
                                 : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 shadow-purple-900/20'
                                 }`}
                         >
                             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                             {loading ? (
                                 <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                             ) : (
                                 <div className="flex items-center gap-2 relative z-10">
                                     <span>{isLogin ? (userType === 'customer' ? 'Login with Phone' : 'Login as Retailer') : 'Create Account'}</span>
                                     <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                 </div>
                             )}
                         </button>
                     </form>
                 </div>
             </div>
        </div>
    )
}
