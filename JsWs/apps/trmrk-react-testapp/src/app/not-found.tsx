import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-xl mt-4">Page Not Found</h2>
      <p className="text-zinc-500 mt-2">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link 
        href="/" 
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}
