import Link from 'next/link';
import { useRouter } from 'next/router';

export default ({ currentUser }) => {
  const router = useRouter();

  const handleLogoClick = (e) => {
    e.preventDefault();
    // Eg. router.pathname = /tickets/[ticketId]
    if (router.pathname !== '/') {
      router.push('/');
    }
  };

  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link className="nav-link" href={href}>
            {label}
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <a className="navbar-brand" href="/" onClick={handleLogoClick}>
        GitTix
      </a>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
