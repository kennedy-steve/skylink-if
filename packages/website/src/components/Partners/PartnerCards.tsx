import React from 'react';
import Link from '@docusaurus/Link';
import styles from './PartnerCards.module.css';

type PartnerCardItem = {
    name: string,
    description: JSX.Element,
    invite: string,
    imageUrl: string,
}

const SkylinkPartner: PartnerCardItem = {
    name: 'Skylink',
    description: (
        <>
            The birthplace of Skylink-IF
        </>
    ),
    invite: 'https://dsc.gg/skylink',	
    imageUrl: 'img/partners/skylink_logo.png',
}

const YourServerHerePartner: PartnerCardItem = {
    name: 'Your server here',
    description: (
        <>
            Join Skylink and ask the developers to become a partner!
        </>
    ),
    invite: 'https://www.youtube.com/watch?v=crg0WAlBdTo',	
    imageUrl: 'img/partners/food-potato.png',
}


const PartnerCardList: PartnerCardItem[] = [
    SkylinkPartner,
    YourServerHerePartner,
    YourServerHerePartner,
    YourServerHerePartner,
    YourServerHerePartner,
    YourServerHerePartner,
]

function PartnerCard({
    name,
    description,
    invite,
    imageUrl,
    }: PartnerCardItem
) {
    return (
        <div className="col col--3">
            <div className={styles.partnerCard}>
                <div className="card">
                    <div className="card__image">
                        <img
                            className={styles.partnerCardImage}
                            src={imageUrl}
                            alt={name}
                            title={name}
                        />
                    </div>
                    <div className="card__body">
                        <h3>{name}</h3>
                        <p>
                            {description}
                        </p>
                    </div>
                    <div className="card__footer">
                        <Link
                            className="button button--outline button--secondary"
                            to={invite}>
                            Join
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function PartnerCards() {
    return (
        
        <section className={styles.partnerCards}>
            <div className="row">
                {PartnerCardList.map(card => (
                    <PartnerCard
                        key={card.name}
                        name={card.name}
                        description={card.description}
                        invite={card.invite}
                        imageUrl={card.imageUrl}
                    />
                ))}
            </div>
        </section>
        
    )
}