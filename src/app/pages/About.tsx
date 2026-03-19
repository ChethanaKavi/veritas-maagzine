import { useEffect } from "react";
import { Advertisement } from "../components/Advertisement";
import { BookOpen, Lightbulb, Globe, Rocket, Users, TrendingUp } from "lucide-react";

export function About() {
  useEffect(() => { document.title = 'About — Veritas Innovations Digital Magazine'; }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex gap-8 items-start">
        <div className="flex-1 min-w-0">

          {/* ── Hero ── */}
          <section className="mb-16">
            <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              Sri Lanka's First Dedicated Innovation Magazine
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 leading-tight">
              Veritas Innovations<br className="hidden sm:block" /> Digital Magazine
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
              Veritas Innovations proudly presents Sri Lanka's first dedicated digital magazine
              focused on entrepreneurship, technology, and innovation. This platform is designed
              to spotlight visionary leaders, emerging startups, groundbreaking ideas, and
              transformative technologies shaping the future.
            </p>
          </section>

          {/* ── Mission ── */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-900">Our Mission</h2>
            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Through insightful articles, expert perspectives, success stories, and industry
                trends, the magazine aims to <span className="font-semibold text-blue-900">inspire, educate, and empower</span> the
                next generation of innovators and change-makers.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                It serves as a dynamic hub where creativity meets strategy — bridging the gap
                between <span className="font-semibold text-blue-900">ideas and impact</span>.
              </p>
            </div>
          </section>

          {/* ── What We Cover ── */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-blue-900">What We Cover</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { icon: Rocket, title: "Startups & Entrepreneurship", desc: "From ideation to scale — we spotlight the founders, stories, and lessons behind Sri Lanka's boldest ventures." },
                { icon: Lightbulb, title: "Technology & Innovation", desc: "Deep dives into emerging technologies, digital transformation, and the tools reshaping industries." },
                { icon: TrendingUp, title: "Industry Trends", desc: "Timely analysis of market shifts, investment landscapes, and the forces driving the innovation economy." },
                { icon: Users, title: "Visionary Leaders", desc: "Interviews and profiles of the changemakers and thought leaders shaping tomorrow's world." },
                { icon: Globe, title: "Global Perspectives", desc: "Local stories with global relevance — connecting Sri Lanka's innovation ecosystem to the world stage." },
                { icon: BookOpen, title: "Expert Insights", desc: "Curated perspectives from industry veterans, academics, and practitioners across every sector." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 bg-white border-2 border-blue-100 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="flex-shrink-0 w-11 h-11 bg-blue-900 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 mb-1 text-sm sm:text-base">{title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Our Story ── */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-900">Our Story</h2>
            <div className="relative bg-blue-900 text-white rounded-2xl p-8 sm:p-10 overflow-hidden">
              {/* decorative circle */}
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />
              <div className="relative">
                <p className="text-lg leading-relaxed mb-4 text-blue-100">
                  Veritas Innovations was born from a belief that Sri Lanka's entrepreneurial and
                  technological potential is vastly underrepresented in the media landscape.
                </p>
                <p className="text-lg leading-relaxed mb-4 text-blue-100">
                  We set out to change that — by creating a world-class digital publication
                  that amplifies local innovation and connects it to a global audience of
                  curious readers, investors, and collaborators.
                </p>
                <p className="text-lg leading-relaxed text-blue-200">
                  Every issue is a testament to the power of ideas — and to the people bold
                  enough to bring them to life.
                </p>
              </div>
            </div>
          </section>

          {/* ── Advertisement ── */}
          <section className="mb-12">
            <Advertisement area="bottom-strip" />
          </section>

          {/* ── Contact ── */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-900">Get in Touch</h2>
            <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-8 border-2 border-blue-200">
              <p className="text-lg text-gray-700 mb-6">
                Have a story idea, partnership inquiry, or want to feature your innovation?
                We'd love to hear from you.
              </p>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <h3 className="font-bold mb-1 text-blue-900 text-sm uppercase tracking-wide">Editorial</h3>
                  <a href="mailto:editorial@veritasinnovations.com" className="text-blue-600 hover:underline text-sm break-all">
                    editorial@veritasinnovations.com
                  </a>
                </div>
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <h3 className="font-bold mb-1 text-blue-900 text-sm uppercase tracking-wide">Advertising</h3>
                  <a href="mailto:advertising@veritasinnovations.com" className="text-blue-600 hover:underline text-sm break-all">
                    advertising@veritasinnovations.com
                  </a>
                </div>
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <h3 className="font-bold mb-1 text-blue-900 text-sm uppercase tracking-wide">General Inquiries</h3>
                  <a href="mailto:info@veritasinnovations.com" className="text-blue-600 hover:underline text-sm break-all">
                    info@veritasinnovations.com
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar Ad */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Advertisement area="sidebar" />
        </div>
      </div>
    </div>
  );
}

