"use client";

export default function Demo() {
  return (
    <section id="demo" className="py-24 px-8 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-white mb-4">
            See it in action
          </h2>
          <div className="w-16 h-px bg-white/20 mx-auto"></div>
        </div>

        <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-black relative">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/2QXUQ8OLceQ?si=xbH8sKGt9svJ-SNL"
            title="PenAI Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="col-span-3 md:col-span-1 flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <span className="text-xl font-light">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Connect Repository</h3>
            <p className="text-sm text-white/60">
              Link your GitHub repository with a single click
            </p>
          </div>

          <div className="col-span-3 md:col-span-1 flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <span className="text-xl font-light">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Generate README</h3>
            <p className="text-sm text-white/60">
              Our AI analyzes your code and creates the perfect README
            </p>
          </div>

          <div className="col-span-3 md:col-span-1 flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <span className="text-xl font-light">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Customize & Publish</h3>
            <p className="text-sm text-white/60">
              Edit if needed and publish directly to your repository
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
