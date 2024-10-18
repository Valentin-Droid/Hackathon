import React, { useState } from 'react';
import './QACard.css';  // Importez le fichier CSS

export const QACard = () => {
    const [flipped, setFlipped] = useState(false);  // Gère l'état de la carte retournée

    const handleCardClick = () => {
        setFlipped(!flipped);  // Inverse l'état pour activer/désactiver la rotation
    };

    return (
        <div className={`card ${flipped ? 'flipped' : ''}`} onClick={handleCardClick}>
            <div className="card-inner">
                {/* La partie avant de la carte */}
                <div className="card-front">
                    <p>Question Template</p>
                </div>
                {/* La partie arrière de la carte */}
                <div className="card-back">
                    <p>Answer Template</p>
                </div>
            </div>
        </div>
    );
};
