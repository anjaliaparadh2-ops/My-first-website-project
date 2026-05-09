export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Academic Notes Portal. All rights reserved.</p>
          <p className="mt-2">Built with ❤️ for students</p>
        </div>
      </div>
    </footer>
  );
}
