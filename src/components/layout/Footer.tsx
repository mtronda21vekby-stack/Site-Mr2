import { callNumber, callHref } from '@/lib/site-data';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface-2 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="mb-3 font-sora text-sm font-semibold text-text">
            Planetlocksmiths
          </h3>
          <p className="text-sm text-muted">
            Premium mobile automotive locksmiths in Philadelphia.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-sora text-sm font-semibold text-text">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <a href="#services" className="transition-colors hover:text-text">
                Services
              </a>
            </li>
            <li>
              <a href="#why" className="transition-colors hover:text-text">
                Why Us
              </a>
            </li>
            <li>
              <a href="#faq" className="transition-colors hover:text-text">
                FAQ
              </a>
            </li>
            <li>
              <a href="#contact" className="transition-colors hover:text-text">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-sora text-sm font-semibold text-text">
            Contact
          </h3>
          <p className="text-sm text-muted">Philadelphia, PA</p>
          <a
            href={callHref}
            className="mt-2 block text-sm font-medium text-accent-blue hover:underline"
          >
            {callNumber}
          </a>
        </div>
        <div>
          <h3 className="mb-3 font-sora text-sm font-semibold text-text">
            Service Area
          </h3>
          <p className="text-sm text-muted">
            We proudly serve the entire Philadelphia region and surrounding
            areas.
          </p>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} Planetlocksmiths. All rights reserved.
      </p>
    </footer>
  );
}
