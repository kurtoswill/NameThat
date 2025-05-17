export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-5xl font-bold text-pink mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
      <a href="/explore" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Back to Explore</a>
    </div>
  );
}
