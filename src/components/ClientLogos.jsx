export default function ClientLogos() {
  const clients = [
    { name: 'IBI', url: 'https://www.ibi.co.il' },
    { name: 'Technion', url: 'https://www.technion.ac.il' },
    { name: 'Strauss', url: 'https://www.strauss-group.com' },
    { name: 'Maccabi', url: 'https://www.maccabi4u.co.il' },
    { name: 'HapPpy', url: '#' },
    { name: 'AIG', url: 'https://www.aig.co.il' },
    { name: 'AdGPT', url: 'https://adgpt.com' },
  ];

  return (
    <section className="py-16 md:py-20 px-6 max-w-7xl mx-auto">
      <p className="font-mono text-xs text-black/40 uppercase tracking-widest text-center mb-10">
        Trusted by leading brands
      </p>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
        {clients.map((client) => (
          <div
            key={client.name}
            className="group flex items-center justify-center h-12 px-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          >
            <span className="font-sans font-bold text-lg md:text-xl tracking-tight text-black/70 group-hover:text-black transition-colors uppercase">
              {client.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
