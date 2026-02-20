// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="sticky top-[100vh] backdrop-blur-xl bg-black/30 border-t border-white/10 shadow-lg mt-8 rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Credit line */}
          <p className="text-gray-300 text-lg font-light tracking-wide">
            Built by{' '}
            <span className="font-serif font-bold bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
              Saptaparno Chakraborty
            </span>
          </p>

          {/* Year and project note */}
          <p className="text-sm text-gray-400 tracking-wide">
            First MERN Learning Project • 2025
          </p>

          {/* Decorative gold line */}
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full"></div>
        </div>
      </div>
    </footer>
  );
}