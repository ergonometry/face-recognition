import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputimage' alt='' src={imageUrl}  width='500px' height='auto'/>
                { 
                    box.length ? box.map((item,i) => <div key={i} className='bounding-box' style={{left: item.leftCol, top: item.topRow, right: item.rightCol, bottom: item.bottomRow}}></div>) : ''
                };
                    {/* In the Javascript expression above (it's JS because we're using {} (curly brackets)) */} 
                        {/* we're using a ternary operator, which is (condition ? expression1 : expression2) if true, return expression1, if false, return expression2) */}
                            {/* given box.length, if true, run this map method on the box (this.state.box) array, and if we remember, when we do a loop, we need to have a unique key prop or else it would prompt a warning (Each child in a list should have a unique "Key" prop) */}
            </div>
        </div>
    );
}

// we can see that in the parameters, we 'deconstructed' and passed the prop 'box' so that now we can use the data of 'box' (which is this.state.box (the array of the values of the box(es)))


export default FaceRecognition;