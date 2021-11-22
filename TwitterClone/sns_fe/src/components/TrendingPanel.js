import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import {smallMargin, mediumMargin} from '../util/cssVar';

const cardStyle = {
    width: '90%',
    margin: mediumMargin.margin,
};


/**
 * Take an array of Strin of popular tag and display them
 */
function displayHastag(stringArray){
    try{
        return stringArray.map(str => {
            return <Badge variant="info" style={smallMargin}>str</Badge>
        })
    }catch(e){
        
    }
}
export default function TrendingPanel() {
    // const [count, setCount] = useState(0);
    useEffect(() => {
        // document.title = `You clicked ${count} times`;
    });


    return (<div>
        <Card bg="secondary" style={cardStyle}>
            <Card.Header>Popular Hastag</Card.Header>
            <Card.Body>
                <h3>
                    {displayHastag(["str1", "str2"])}
                </h3> 
            </Card.Body>
        </Card>


    </div>)
}