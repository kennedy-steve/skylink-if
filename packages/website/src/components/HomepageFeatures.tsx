/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Make it Yours',
    image: '/img/index/undraw_new_ideas_jdea.svg',
    description: (
      <>
        Skylink-IF is currently in very early development. 
        How can we make Infinite Flight more fun for you? Put your ideas here: 
        <a href="https://forms.gle/NM17sCK82Wn75K337"> https://forms.gle/NM17sCK82Wn75K337</a>
      </>
    ),
  },
  {
    title: 'Join our Team',
    image: '/img/index/undraw_open_source_-1-qxw.svg',
    description: (
      <>
        Feeling inexperienced? We'd love to help you grow as a developer. 
        If you're a Typescript master, have fun with us! Skylink-IF is designed to be a fun side project.
        Get plugged in through our discord: 
        <a href="https://dsc.gg/skylink"> https://dsc.gg/skylink</a>
      </>
    ),
  },
  {
    title: 'Documentation Prioritization',
    image: '/img/index/undraw_file_searching_re_3evy.svg',
    description: (
      <>
        We'll be prioritizing concise, well-written documentation to make it more enjoyable for 
        new developers to join in! 
        Do not be afraid --  we're here to help you 🥰
      </>
    ),
  },
];

function Feature({title, image, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container item shadow--tl">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
