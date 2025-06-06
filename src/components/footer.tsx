export default function Footer() {
  return (
    <footer className="py-20 px-8 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Large product name as background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h2 className="text-[2vw] md:text-[10vh] font-bold text-white/20 select-none tracking-tighter">README GENERATOR</h2>
        </div>

        {/* Minimal footer content */}
        {/* <div className="relative flex flex-col md:flex-row justify-between items-center gap-4 z-10">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Readme Generator. All rights reserved.</p>
          <div className="flex items-center text-xs text-white/40">
            Made with ❤️ by{" "}
            <a
              href="https://arrpit.work"
              target="_blank"
              rel="noopener noreferrer"
              className="underline px-1 hover:text-white/60 transition-colors"
            >
              Arrpit
            </a>
          </div>
        </div> */}
      </div>
    </footer>
  )
}

