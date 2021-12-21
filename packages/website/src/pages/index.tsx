import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import HomepageDemo from '../components/HomepageDemo';
import HomepageFeatures from '../components/HomepageFeatures';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero shadow--lw', styles.heroBanner)}>
      <div className='container'>
        <img src='img/index/skylink-hero-title.svg'/>
        <p className='hero__subtitle'>{siteConfig.tagline}</p>

        <div className={styles.buttons}>
          <Link
            className='button button--primary button--lg'
            to='https://forms.gle/NM17sCK82Wn75K337'>
            Add to Discord
          </Link>
        </div>


      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description='Bringing Infinite Flight to Discord'>
      <HomepageHeader />
      <main>
        <HomepageDemo />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
