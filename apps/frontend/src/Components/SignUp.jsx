import React from 'react';

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-0 font-normal text-base text-[#1c1b1b] bg-[#F0F2F5]">
      {/* Main Container for Auth Flow */}
      <main className="w-full max-w-[440px] flex flex-col items-center justify-center min-h-[calc(100vh-200px)] pt-20 pb-20">
        {/* Auth Card */}
        <div className="w-full bg-[#ffffff] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-[40px] flex flex-col">
          
          {/* Brand Logo & Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            
            <h1 className="text-[32px] leading-[1.2] tracking-[-0.01em] font-extrabold text-[#4441c4] mb-1">Pentagram</h1>
            <h2 className="text-[20px] leading-[1.4] font-semibold text-[#1c1b1b] mb-1">Create your account</h2>
            <p className="text-[14px] leading-[1.5] text-[#464554]">Join Pentagram and start sharing</p>
          </div>

          {/* Sign Up Form */}
          <form className="flex flex-col gap-4 w-full">
            {/* Username Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] leading-[1] tracking-[0.05em] font-semibold text-[#464554] uppercase" htmlFor="username">Username</label>
              <input className="w-full h-12 px-4 rounded-lg border border-[#777585] bg-[#ffffff] text-[#1c1b1b] focus:border-[#4441c4] focus:ring-1 focus:ring-[#4441c4] outline-none transition-colors duration-200" id="username" name="username" placeholder="Enter your username" required type="text" />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] leading-[1] tracking-[0.05em] font-semibold text-[#464554] uppercase" htmlFor="email">Email</label>
              <input className="w-full h-12 px-4 rounded-lg border border-[#777585] bg-[#ffffff] text-[#1c1b1b] focus:border-[#4441c4] focus:ring-1 focus:ring-[#4441c4] outline-none transition-colors duration-200" id="email" name="email" placeholder="name@example.com" required type="email" />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] leading-[1] tracking-[0.05em] font-semibold text-[#464554] uppercase" htmlFor="password">Password</label>
              <input className="w-full h-12 px-4 rounded-lg border border-[#777585] bg-[#ffffff] text-[#1c1b1b] focus:border-[#4441c4] focus:ring-1 focus:ring-[#4441c4] outline-none transition-colors duration-200" id="password" name="password" placeholder="Create a password" required type="password" />
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-1 mb-1">
              <label className="text-[12px] leading-[1] tracking-[0.05em] font-semibold text-[#464554] uppercase" htmlFor="confirm-password">Confirm Password</label>
              <input className="w-full h-12 px-4 rounded-lg border border-[#777585] bg-[#ffffff] text-[#1c1b1b] focus:border-[#4441c4] focus:ring-1 focus:ring-[#4441c4] outline-none transition-colors duration-200" id="confirm-password" name="confirm-password" placeholder="Confirm your password" required type="password" />
            </div>

            {/* Submit Button */}
            <button className="w-full h-12 flex items-center justify-center bg-[#4441c4] text-[#ffffff] text-[20px] leading-[1.4] font-semibold rounded-lg shadow-[0_4px_12px_rgba(68,65,196,0.2)] hover:opacity-90 hover:-translate-y-[2px] transition-all duration-200 ease-in-out cursor-pointer mt-1" type="submit">
              Create Account
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-10 text-center">
            <p className="text-[14px] leading-[1.5] text-[#464554]">
              Already have an account?{' '}
              <a className="text-[#4441c4] font-semibold hover:underline transition-all duration-200 cursor-pointer" href="#">Log in</a>
            </p>
          </div>

        </div>
      </main>

      {/* Footer Component */}
      <footer className="text-[#464554] text-[14px] leading-[1.5] flex flex-col md:flex-row justify-center items-center gap-4 w-full py-10 absolute bottom-0 left-0">
        <div className="hidden">Pentagram</div>
        <span>© 2026 Pentagram. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default SignUp;