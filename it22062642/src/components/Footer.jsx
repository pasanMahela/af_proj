export default function Footer() {
    return (
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} <strong>Locatia</strong> — All rights reserved.
          <div className="mt-2 space-x-4">
            <a
              href="https://restcountries.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              REST Countries API
            </a>
            <a
              href="https://github.com/pasanMahela"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    );
  }
  