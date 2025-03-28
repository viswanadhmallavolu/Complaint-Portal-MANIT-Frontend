import React from 'react';
import { Building2, Users, BookOpen, MessageSquare, ArrowRight, Shield } from 'lucide-react';

function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1677c8] to-[#0d4c8b] relative">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')]"></div>

            {/* Navbar */}
            <nav className="relative z-10 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <img src="/logo/MANIT-Logo.png" alt="NIT Bhopal Logo" className="h-16 w-auto hover:bg-white/10 rounded-full transition-all duration-300" />
                        </div>
                        <div className="flex space-x-8">
                            <a href="#about" className="text-blue-100 hover:text-white transition-colors">About</a>
                            <a href="#features" className="text-blue-100 hover:text-white transition-colors">Features</a>
                            <a href="#contact" className="text-blue-100 hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Welcome to NIT Bhopal's Complaint Management System
                        </h2>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                            A streamlined platform for addressing and resolving campus-related concerns efficiently.
                        </p>
                    </div>

                    {/* Login Cards */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Student Login Card */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 rounded-xl p-6 transition-all duration-300">
                            <div className="flex flex-col items-center text-center">
                                <Users className="w-16 h-16 text-white mb-4" />
                                <h3 className="text-2xl font-semibold text-white mb-2">Student Login</h3>
                                <p className="text-blue-100 mb-6">Access your student complaint dashboard</p>
                                <button
                                    onClick={() => window.open('/login', '_blank')}
                                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-all"
                                >
                                    <span>Login as Student</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Admin Login Card */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 rounded-xl p-6 transition-all duration-300">
                            <div className="flex flex-col items-center text-center">
                                <Shield className="w-16 h-16 text-white mb-4" />
                                <h3 className="text-2xl font-semibold text-white mb-2">Admin Login</h3>
                                <p className="text-blue-100 mb-6">Manage and resolve student complaints</p>
                                <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-all">
                                    <span>Login as Admin</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <section id="features" className="mt-24">
                        <h2 className="text-3xl font-bold text-center text-white mb-12">Key Features</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <MessageSquare className="w-8 h-8" />,
                                    title: "Easy Complaint Filing",
                                    description: "Submit and track complaints with our user-friendly interface"
                                },
                                {
                                    icon: <Building2 className="w-8 h-8" />,
                                    title: "Department-wise Tracking",
                                    description: "Efficiently route complaints to relevant departments"
                                },
                                {
                                    icon: <BookOpen className="w-8 h-8" />,
                                    title: "Status Updates",
                                    description: "Real-time updates on complaint resolution progress"
                                }
                            ].map((feature, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                                    <div className="text-white mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-blue-100">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* About Section */}
                    <section id="about" className="mt-24">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
                            <h2 className="text-3xl font-bold text-white mb-6">About the Portal</h2>
                            <p className="text-blue-100 leading-relaxed">
                                The NIT Bhopal Complaint Portal is designed to provide students with a seamless platform
                                to voice their concerns and get them resolved efficiently. Our system ensures transparency,
                                quick response times, and effective communication between students and administration.
                            </p>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section id="contact" className="mt-24 mb-16">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 text-center">
                            <h2 className="text-3xl font-bold text-white mb-6">Need Help?</h2>
                            <p className="text-blue-100 mb-4">
                                If you're facing any issues with the portal, please contact our support team.
                            </p>
                            <p className="text-white">
                                Email: support@nitbhopal.ac.in
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Landing;
