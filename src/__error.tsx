import { Link } from '@tanstack/react-router';

export default function ErrorPage() {
  return (
    <div className="mx-auto mt-6 max-w-lg rounded bg-white px-4 py-6">
      <p className="mb-4 text-lg font-bold">Sorry, an unexpected error has occurred.</p>
      {/* <AppError error={error.error?.message ?? error.message} /> */}
      <Link
        className="mt-3 inline-block text-sm text-blue-500 underline underline-offset-2"
        to="/"
      >
        Navigate home
      </Link>
    </div>
  );
}
