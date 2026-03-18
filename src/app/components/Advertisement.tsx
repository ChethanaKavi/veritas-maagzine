export function Advertisement() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-8 text-center">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs text-blue-600 mb-2 font-semibold">ADVERTISEMENT</p>
        <h3 className="text-2xl font-bold mb-3 text-blue-900">Your Brand Here</h3>
        <p className="text-gray-700 mb-4">
          Reach thousands of engaged readers with your message. Contact us for advertising opportunities.
        </p>
        <button className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
}