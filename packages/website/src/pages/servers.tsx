import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import PartnerCards from '../components/Partners/PartnerCards';
import styles from './servers.module.css';

function ServersHero() {
  return (
    <header className={clsx('hero shadow--lw', styles.heroBanner)}>
      <div className='container'>
        <div className='row'>
          <div className={clsx('col col--6')}>
            <div className={styles.heroText}>
              <h1 className='hero__title'>Servers</h1>
              <p className='hero__subtitle'>
                Cheers to the Infinite Flight community 🥂
              </p>
                <Link
                className='button button--primary button--lg'
                to='https://dsc.gg/skylink'>
                Join Skylink
              </Link>
            </div>
          </div>
          <div className='col col--6'>
            <img className={styles.heroSvg} src='img/partners/undraw_people_tax5.svg'/>
          </div>

        </div>
      </div>
    </header>
  );
}

export default function Servers(): JSX.Element {
  return (
    <Layout
      title='Servers'
      description='Thank you to the Infinite Flight Community'>
      <ServersHero />
      <main>
        <PartnerCards />
      </main>
    </Layout>
  );
}
