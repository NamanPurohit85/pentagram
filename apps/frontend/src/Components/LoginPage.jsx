import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col font-normal text-base text-[#1c1b1b] bg-[#F0F2F5] antialiased">
      {/* Main Container for Auth Flow */}
      <main className="flex-grow flex items-center justify-center p-4 relative z-10 -mt-10 md:-mt-20">
        {/* Auth Card */}
        <div className="w-full max-w-[440px] bg-[#ffffff] rounded-xl p-10 shadow-[0_12px_40px_rgba(0,0,0,0.08)] transform transition-transform hover:-translate-y-0.5 duration-200">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h1 className="text-[32px] leading-[1.2] tracking-tight font-extrabold text-[#4441c4] hidden md:block">Pentagram</h1>
              <h1 className="text-[24px] leading-[1.2] tracking-tight font-extrabold text-[#4441c4] md:hidden">Pentagram</h1>
            </div>
            <h2 className="text-[20px] leading-[1.4] font-semibold text-[#1c1b1b] mb-1">Welcome back</h2>
            <p className="text-[14px] leading-[1.5] text-[#464554]">Log in to continue to Pentagram</p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-[12px] leading-[1] tracking-[0.05em] font-semibold text-[#464554] mb-2 uppercase" htmlFor="email">Email</label>
              <input className="w-full border border-[#777585] rounded-lg px-4 py-3 bg-[#ffffff] text-[#1c1b1b] focus:border-[#4441c4] focus:ring-1 focus:ring-[#4441c4] outline-none transition-colors duration-200" id="email" name="email" placeholder="Enter your email" required type="email" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[12px] leading-[1] tracking-[0.05em] font-semibold text-[#464554] uppercase" htmlFor="password">Password</label>
                <a className="text-[14px] leading-[1.5] text-[#4441c4] hover:text-[#5d5cde] transition-colors duration-200" href="#">Forgot password?</a>
              </div>
              <input className="w-full border border-[#777585] rounded-lg px-4 py-3 bg-[#ffffff] text-[#1c1b1b] focus:border-[#4441c4] focus:ring-1 focus:ring-[#4441c4] outline-none transition-colors duration-200" id="password" name="password" placeholder="Enter your password" required type="password" />
            </div>
            <button className="w-full bg-[#4441c4] text-[#ffffff] rounded-lg py-3 text-[16px] leading-tight font-semibold flex justify-center items-center gap-2 hover:bg-[#5d5cde] transition-all duration-200 shadow-[0_4px_14px_rgba(68,65,196,0.3)] hover:shadow-[0_6px_20px_rgba(68,65,196,0.4)] cursor-pointer" type="submit">
              Log In
            </button>
          </form>



          

          {/* Footer text */}
          <p className="text-center mt-6 text-[14px] leading-[1.5] text-[#464554]">
            Don't have an account? <a className="text-[#4441c4] font-semibold hover:text-[#5d5cde] transition-colors duration-200" href="#">Sign up</a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-transparent w-full bottom-0 flex flex-col md:flex-row justify-center items-center gap-4 py-10 px-6 text-[14px] leading-[1.5] text-[#464554] z-0 relative">
        <div className="mt-1 md:mt-0 opacity-70">
          © 2024 Pentagram. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Login;