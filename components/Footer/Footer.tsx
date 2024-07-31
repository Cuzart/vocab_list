import Link from 'next/link';
import classes from './Footer.module.css';

type Props = {
  site?: 'imprint' | 'privacy';
};

export const Footer = ({ site }: Props) => {
  return (
    <footer className={classes.root}>
      <div className={classes.inner}>
        {site && <Link href='/'>Home</Link>}
        {site !== 'imprint' && <Link href='/imprint'>Impressum</Link>}
        {site !== 'privacy' && <Link href='/privacy'>Datenschutz</Link>}
      </div>
    </footer>
  );
};
