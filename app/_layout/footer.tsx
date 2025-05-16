export const Footer = () => {
  return (
    <footer className="flex justify-center items-center h-16 p-4 bg-gray-800 text-white text-center mt-auto">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Alliance Book. All rights reserved.
        <br />
        Test assignment for <a href="https://meetbrackets.com/">Brackets</a>
      </p>
    </footer>
  )
}
