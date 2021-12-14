import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './partners.module.css';
import PartnerCards from '../components/Partners/PartnerCards';

function PartnersHero() {
  return (
    <header className={clsx('hero shadow--lw', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--6')}>
            <div className={styles.heroText}>
              <h1 className="hero__title">Servers</h1>
              <p className="hero__subtitle">
                Cheers to the Infinite Flight community 🥂
              </p>
                <Link
                className="button button--primary button--lg"
                to="https://forms.gle/NM17sCK82Wn75K337">
                Join Skylink
              </Link>
            </div>
          </div>
          <div className="col col--6">
            <img className={styles.heroSvg} src="img/partners/undraw_people_tax5.svg"/>
          </div>
          
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Partners"
      description="Bringing Infinite Flight to Discord">
      <PartnersHero />
      <main>
        <PartnerCards />
      </main>
    </Layout>
  );
}
