import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import mojs from 'mo-js';
import styles from './index.css';

//change it to see logs in console
const showLog = false;

const initialState = {
  count: 0,
  totalCount: 267,
  isClicked: false
}

const ClapContext = React.createContext({});

// customhook
const useClapAnimation = (clap, clapCount, clapCountTotal) => {
  showLog && console.log('customHook, refs=', clap, clapCount, clapCountTotal);

  const [animationTimeline, setAnimationTimeline ] = useState(()=>new mojs.Timeline());

  useEffect(() => {    
    showLog && console.log('useEffect in hook, refs=', clap, clapCount, clapCountTotal);
    if (clap.current && clapCount.current && clapCountTotal.current) {
      const tlDuration = 300;
      const scaleButton = new mojs.Html({
        el: clap.current,
        duration: tlDuration,
        scale: {1.3: 1},
        easing: mojs.easing.ease.out
      });

      const countTotalAnimation = new mojs.Html({
        el: clapCountTotal.current,
        opacity: {0: 1},
        delay: tlDuration * 3 / 2,
        duration: tlDuration,
        y: {0: -3}
      });

      const countAnimation = new mojs.Html({
        el: clapCount.current,
        opacity: {0:1},
        duration: tlDuration,
        y: {0: -30}
      }).then({
        opacity: {1: 0},
        y: -80,
        delay: tlDuration / 2
      });

      const triangleBurst = new mojs.Burst({
        parent: clap.current,
        radius: {50: 95},
        count: 20,
        angel: 30,
        children: {
          duration: tlDuration,
          shape: 'polygon',
          radius: {6: 0},
          stroke: 'rgba(211,54,0,0.5)',
          strokeWidth: 2,
          angel: 210,
          delay: 30,
          speed: 0.2,
          easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
        }
      });

      const circleBurst = new mojs.Burst({
        parent: clap.current,
        radius: {50: 75},
        count: 20,
        angel: 25,
        duration: tlDuration,
        children: {
          shape: 'circle',
          fill: 'rgba(149,165,166,0.5)',
          delay: 30,
          speed: 0.2,
          radius: {3: 0},
          easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
        }
      });

      clap.current.style.transform = 'scale(1, 1)';
        
      setAnimationTimeline(tl=>tl.add([
        scaleButton, 
        countTotalAnimation,
        countAnimation,
        triangleBurst,
        circleBurst
      ]));    
    }
  }, [clap.current, clapCount.current, clapCountTotal.current]);

  return animationTimeline
}

const MediumClap = ({ onClap, children}) => {  

  const [ { count, totalCount, isClicked }, setClapState ] = useState(initialState);

  //just normal refs
  const clap = useRef();
  const clapCount = useRef();
  const clapCountTotal = useRef();  

  useEffect(()=>{
    showLog && console.log('mediumclap render, refs=',clap, clapCount, clapCountTotal);
  });
 

  const MAXIMUM_USER_CLAP = 50;
  
  const animationTimeline = useClapAnimation(clap, clapCount, clapCountTotal);  

  const handleClapClick = () => {
    animationTimeline.replay();
    onClap();
    setClapState(({ count, totalCount }, add = +(count < MAXIMUM_USER_CLAP)) => ({
      count:count + add, totalCount:totalCount + add, isClicked: true
    }))
  }
  
  const value = useMemo(()=>({clapCount, clapCountTotal, count, totalCount, isClicked}),
  [clapCount, clapCountTotal, count, totalCount, isClicked])
  

  return (
    <div style={{width:'100%'}}>
      <ClapContext.Provider value={value}>
        <button ref={clap} className={styles.clap} onClick={handleClapClick}>
          {children}
        </button>
      </ClapContext.Provider>
      <h3>03.js useRef + customHook + useEffect + Context with useMemo</h3>
    </div>    
  )

}

const ClapIcon = () => {  
  const { isClicked } = useContext(ClapContext);  

  useEffect(()=>{
    showLog && console.log('ClapIcon render');
  });  
  return <span>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='-549 338 100.1 125'
        className={`${styles.icon} ${isClicked && styles.checked}`}
      >
        <path d='M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z' />
        <path d='M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9' />
      </svg>
  </span>  
};

const ClapCount = () => {
  const { count, clapCount } = useContext(ClapContext);
  useEffect(()=>{
    showLog && console.log('ClapCount render');
  });
  return (
    <span ref={clapCount} className={styles.count}>+{count}</span>
  )
};

const ClapTotal = () => {
  const { totalCount, clapCountTotal } = useContext(ClapContext);
  useEffect(()=>{
    showLog && console.log('ClapTotal render');
  });
  return (
    <span ref={clapCountTotal} className={styles.total}>{totalCount}</span>
  )
}; 

MediumClap.Icon = ClapIcon;
MediumClap.Count = ClapCount;
MediumClap.Total = ClapTotal;


const Usage = () => {

  const [ state, setState ] = useState(0);

  return (
    <div>
      <MediumClap onClap={()=>setState(state=>state+1)}>
        <MediumClap.Icon />
        <MediumClap.Count />
        <MediumClap.Total />
      </MediumClap>
      <p>You have clapped {state} times</p>
    </div>
  )
}

export default Usage;