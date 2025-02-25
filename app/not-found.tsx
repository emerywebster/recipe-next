import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="text-lg text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link href="/" className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground">
        Go back home
      </Link>
    </div>
  );
}
