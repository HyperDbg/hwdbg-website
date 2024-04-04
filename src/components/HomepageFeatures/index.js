import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Customizable',
    Svg: require('@site/static/img/chip-connection-main-page.svg').default,
    description: (
      <>
        hwdbg is open-source, providing extensive customization options. Easily modify configurations for a debugger that suits your specific needs.
      </>
    ),
  },
  {
    title: 'IP Core',
    Svg: require('@site/static/img/ip-design-main-page.svg').default,
    description: (
      <>
        Synthesize and deploy on various FPGA boards seamlessly. A versatile solution for diverse hardware environments.
      </>
    ),
  },
  {
    title: 'Black-Box Debugger',
    Svg: require('@site/static/img/chip-main-page.svg').default,
    description: (
      <>
        No source code? No problem. Debug IP or chip's input/output signals directly. Ideal for debugging and troubleshooting without accessing the IP's internals.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
