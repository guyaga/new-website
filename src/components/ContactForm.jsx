import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_KEY',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New message from ${formData.name} via guyaga.com`,
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact-form" className="bg-black text-white py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-paper/40 uppercase tracking-widest mb-3">Get in Touch</p>
        <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight uppercase mb-12">
          Let&apos;s Work Together
        </h2>

        {status === 'success' ? (
          <div className="text-center py-16">
            <p className="font-sans text-2xl font-bold mb-2">Message Sent</p>
            <p className="font-mono text-sm text-paper/60">I&apos;ll get back to you shortly.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-8 font-mono text-sm text-signal-red hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block font-mono text-xs text-paper/40 uppercase mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-3 font-sans text-white outline-none transition-colors placeholder:text-white/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-mono text-xs text-paper/40 uppercase mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-3 font-sans text-white outline-none transition-colors placeholder:text-white/20"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block font-mono text-xs text-paper/40 uppercase mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-3 font-sans text-white outline-none transition-colors resize-none placeholder:text-white/20"
                placeholder="Tell me about your project..."
              />
            </div>

            {status === 'error' && (
              <p className="font-mono text-sm text-signal-red">Something went wrong. Please try again.</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="relative overflow-hidden group bg-signal-red text-white px-8 py-3 rounded-full font-sans font-semibold text-sm transition-transform disabled:opacity-50"
            >
              <span className="relative z-10">
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </span>
              <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
              <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out opacity-0 group-hover:opacity-100 z-10 flex items-center justify-center text-black font-semibold text-sm">
                Send Message
              </span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
