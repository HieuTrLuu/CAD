import React, { useState, useEffect } from 'react';
import TwitContent from './TwitContent';
import { getAllTwits } from '../../util/rest'

function TwitListDisplay(props) {
    const [twits, setTwits] = useState([]);
    useEffect(() => {
        // effect
        getAllTwits().then(res => {
            // console.log(`get all TWits res = ${res}`);
            // console.log(`userID = ${props.userId}`)
            if (!props.isFeed) {
                let profileTwit = res.filter(twit => twit.userId == props.userId);
                setTwits(profileTwit);
            } else {
                setTwits(res);
            }
        })

        return () => {
            // cleanup
        };
    }, [props.userId])



    function display() {
        try {
            return twits.map(twit => {
                return <TwitContent key={twit.text} text={twit.text} imgURL={twit.imgURL} time={twit.time} name={twit.userName} userId={twit.userId}/>
            })
        }catch{
            
        }
    }

    return (
        <div className='TwitListDisplay'>
            {display()}
        </div>
    )
}

TwitListDisplay.defaultProps = {
    isFeed: true,
    userId: ''
}


export default TwitListDisplay;
