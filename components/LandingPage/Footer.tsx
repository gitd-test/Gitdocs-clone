import Image from "next/image";
import logo from "@/app/favicon.ico";

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
            <Image
                src={logo || "/default-logo.png"}
                width={33}
                height={33}
                alt="logo"
            />
              <span className="text-lg font-semibold">GitDocs AI</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Transform your documentation process with the power of AI. 
              Save time and keep your docs in sync with your code.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-gitdocs-blue">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-gitdocs-blue"
              >
                <svg
                  className="h-4 w-4 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 19h-2.5v-9h2.5v9zm-1.25-10.29c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13 10.29h-2.5v-4.5c0-1.1-.9-2-2-2s-2 .9-2 2v4.5h-2.5v-9h2.5v1.36c.78-.91 1.91-1.36 3.14-1.36 2.1 0 3.86 1.71 3.86 4.29v4.71z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-gitdocs-blue">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-muted-foreground hover:text-gitdocs-blue">Features</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-gitdocs-blue">Pricing</a></li>
              <li><a href="#documentation" className="text-muted-foreground hover:text-gitdocs-blue">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-muted-foreground hover:text-gitdocs-blue">About</a></li>
              <li><a href="#blog" className="text-muted-foreground hover:text-gitdocs-blue">Blog</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-gitdocs-blue">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-gitdocs-blue">Terms</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-gitdocs-blue">Privacy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} GitDocs AI. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <form className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Subscribe to our newsletter"
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gitdocs-blue/50 focus:border-gitdocs-blue/50 text-sm w-full md:w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gitdocs-blue text-white rounded-md text-sm font-medium hover:bg-gitdocs-blue/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
