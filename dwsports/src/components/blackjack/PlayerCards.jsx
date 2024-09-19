import React, {useMemo,useRef,useEffect,useState} from 'react'
import {BlackJackCards,UserAvatar,UserChipSum,EmptyCardLine,CardHolder,SportsCarousel,InnerSportsCarousel,
    Card,
} from './index'
import { IconButton, Avatar } from '@mui/material'
import { motion } from 'framer-motion'
import chipImage from '../../assets/chips/emptyChip.png'
import { transitionLong,animationFour } from '../../animations';

const PlayerCards = ({players,player,activePlayer,rooms,gameFinished}) => {

    const carroussel = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [width, setWidth] = useState(0);

    

    useEffect(() => {
        //console.log(carroussel.current.scrollWidth, carroussel.current.offsetWidth);
        if(carroussel.current){
          setWidth(carroussel.current.scrollWidth - carroussel.current.offsetWidth);
        }
    })

      const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1) % players?.length);
      };
      const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1 + players?.length) % players?.length);
      };

    const getTransformForIndex = (index) => {
        const transforms = [
          'translateZ(0) rotateX(15deg)',
          'rotateY(10deg) translateX(520px) translateZ(-50px) rotateX(15deg) scale(1.05)',
          'rotateY(5deg) translateX(250px) translateZ(-50px) rotateX(15deg) scale(1.05)',
          'rotateY(-5deg) translateX(-250px) translateZ(-50px) rotateX(15deg) scale(1.05)',
          'rotateY(-10deg) translateX(-520px) translateZ(-50px) rotateX(15deg) scale(1.05)'
        ];
        return transforms[index];
    };

    const CardSpot = React.memo(({ transform, index, currentIndex }) => {
        if (!players || players.length === 0) return null;
    
        // Calculate the content index for this card spot
        const contentIndex = (index - currentIndex + players.length) % players.length;
    
        // Check if we should render content
        const shouldRenderContent = index < players.length;
        const player = shouldRenderContent ? players[contentIndex] : null;
    
        return (
          <div className="card-spot" style={{ transform }}>
            {shouldRenderContent && players ? (
              <motion.div
                className="card-content"
                key={player.id}
                initial={{ opacity: 0 }} // Only animate opacity, no x movement
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Display dynamic content */}
                <UserAvatar><Avatar alt="Image" src={player.avatar} sx={{ width: 80, height: 80 }} /></UserAvatar>
                <UserChipSum id="chipSum" style={{ backgroundImage: `url(${chipImage})`, backgroundPosition: 'center' }}>{player.bet}</UserChipSum>
                <EmptyCardLine></EmptyCardLine>
                <EmptyCardLine>{player.name}</EmptyCardLine>
                <CardHolder>
                <SportsCarousel ref={carroussel}>
                <InnerSportsCarousel drag="x" dragConstraints={{right: 0, left: -width}} whileTap={{cursor: 'grabbing'}}>
                  {player.hand?.map((card) => {
                    return (
                      <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center'}}>
                      <Card key={card} style={{backgroundImage: `url(./assets/cards/${card}.png)`,
                      backgroundSize: 'contain',}} initial="out" animate="in" variants={animationFour} transition={transitionLong} activePlayer={activePlayer}></Card>
                      </div>
                    )
                  })}
                  </InnerSportsCarousel>
                  </SportsCarousel>
                  <EmptyCardLine>POINTS: {player.playerSum}</EmptyCardLine>
                </CardHolder>
              </motion.div>
            ) : (
              <div className="card-content empty"></div> // Render empty content
            )}
          </div>
        );
    });

  return (
    <BlackJackCards animate={{ height: activePlayer || gameFinished ? '55vh' : '60vh' }}
        initial={{ height: '70vh' }}
        transition={{ duration: 0.5 }}>
          {/* <IconButton  onClick={disconnect}><Disconnect /></IconButton> */}
          {Array.from({ length: 5 }).map((_, i) => (
              <CardSpot
                key={i}
                transform={getTransformForIndex(i)}
                index={i}
                currentIndex={currentIndex}
                players={players}
              />
            ))}
        </BlackJackCards>
  )
}

export default PlayerCards
