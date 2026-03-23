import { Advertisement } from "../components/Advertisement";
import { BookOpen, Users, Globe, Award } from "lucide-react";

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="text-5xl font-bold mb-6 text-blue-900">About Modern Magazine</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          We are a digital-first publication committed to delivering insightful,
          well-researched content across technology, business, fashion, nature,
          travel, and culinary arts.
        </p>
      </section>

      {/* Mission Statement */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-blue-900">Our Mission</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          At Modern Magazine, we believe in the power of storytelling to inform,
          inspire, and connect people across the globe. Our mission is to create
          content that not only captures the zeitgeist but also provides depth,
          context, and nuance to the stories that matter most.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          We strive to maintain the highest journalistic standards while embracing
          innovation in digital publishing. Every article, photograph, and design
          element is crafted with care to deliver an exceptional reading experience.
        </p>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-blue-900">Our Values</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Editorial Excellence</h3>
              <p className="text-gray-600">
                We maintain rigorous editorial standards, fact-checking every piece
                and working with expert contributors to ensure accuracy and depth.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Diverse Perspectives</h3>
              <p className="text-gray-600">
                Our team of writers, photographers, and editors come from varied
                backgrounds, bringing unique viewpoints to every story.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Global Reach</h3>
              <p className="text-gray-600">
                With readers in over 100 countries, we cover stories from around
                the world, connecting global audiences through shared interests.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Award-Winning Content</h3>
              <p className="text-gray-600">
                Our work has been recognized with numerous industry awards for
                journalism, photography, and digital innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-blue-900">Our Story</h2>
        <div className="bg-blue-50 rounded-lg p-8 border-2 border-blue-200">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Founded in 2020, Modern Magazine emerged during a time of unprecedented
            change. As the world shifted digital, we saw an opportunity to reimagine
            what a magazine could be in the 21st century.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Starting with a small team of passionate journalists and designers, we
            launched our first issue focusing on technology and innovation. The
            response was overwhelming, and we quickly expanded to cover business,
            fashion, nature, travel, and culinary arts.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Today, Modern Magazine reaches millions of readers monthly, but our
            commitment remains the same: to tell stories that matter, with integrity,
            creativity, and impact.
          </p>
        </div>
      </section>

      {/* Advertisement */}
      <section className="mb-12">
        <Advertisement area="Footer" className="rounded-lg overflow-hidden" />
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-blue-900">Get in Touch</h2>
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-8 border-2 border-blue-200">
          <p className="text-lg text-gray-700 mb-6">
            We'd love to hear from you. Whether you have a story idea, feedback,
            or partnership inquiry, our team is here to help.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1 text-blue-900">Editorial</h3>
              <a
                href="mailto:editorial@modernmagazine.com"
                className="text-blue-600 hover:underline"
              >
                editorial@modernmagazine.com
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-blue-900">Advertising</h3>
              <a
                href="mailto:advertising@modernmagazine.com"
                className="text-blue-600 hover:underline"
              >
                advertising@modernmagazine.com
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-blue-900">General Inquiries</h3>
              <a
                href="mailto:info@modernmagazine.com"
                className="text-blue-600 hover:underline"
              >
                info@modernmagazine.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}