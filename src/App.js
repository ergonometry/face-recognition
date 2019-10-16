import React, { Component } from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "./App.css";

const app = new Clarifai.App({
  apiKey: "39d724ef70ae41269091815b2c038508",
});

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    size: {
      enable: true,
      value: 2,
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: [],
    };
  }

  calculateFaceLocation = data => {
    let boxArray = []; // instead of creating a new array (because in order to use the map method, we need to have an array), we can simply set this.state.box: [] (an array) like above, however, if we decided to set this.state.box: {} (an object), then we'd have to create a new array to push it in in other to use the array loop methods (if we tried to use the push method (like below), when this.state.box: {} (is an object) it wouldn't work because we need it to be an array to use the push method.)
    // UPDATE: we actually need to create an empty array WITHIN the 'calculateFaceLocation function (see the 'MAJOR FLAW RIGHT NOW' comment below (if we use 'this.state.box' (where box: []) instead of creating 'boxArray')), the reason why we need to create an empty array is because if we use 'this.state.box' as the array in which we are pushing the values of the box in, then we're going to get the flaw that we were talking about (array containing both old and new values and generating old and new boxes on the URL image).
    // NOTE from Nabil about 'constructor in React':
    // constructor sets the state initially once the app starts ***and it DOESN'T get reset***, constructor fires off once and that's it, so it SAVES all values while your app is still running hence why we encountered that major flaw when we used 'this.state.box' as the containing array, it SAVES the values and generates us all the boxes that it saved.
    // therefore we should never update the state directly with this.state BECAUSE React needs to figure out when to re-render (and it can only do that if we use their 'setState' call) ?then it compares the DOM with the virtual DOM? (what does this mean)

    const clarifaiFace = data.outputs[0].data.regions;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height);

    // the for of loop syntax is: for (variable of iterable) { statement } **iterables are arrays and strings (able to iterate over INDIVIDUAL items) so in this case 'data.outputs[0].data.regions' is an array
    for (const face of clarifaiFace) {
      boxArray.push({
        bottomRow: height - face.region_info.bounding_box.bottom_row * height,
        leftCol: face.region_info.bounding_box.left_col * width,
        rightCol: width - face.region_info.bounding_box.right_col * width,
        topRow: face.region_info.bounding_box.top_row * height,
      });
      // here what we're doing is we are looping over each 'face' (items of the array) from the array 'const clarifaiFace' that it detects and pushes the value of the box (columns and rows) into the 'this.state.box' array so that later on in 'FaceRecognition.js' we can map over the array and have it generate the box (CSS lines).

      // *** THE MAJOR FLAW RIGHT NOW: every time we click detect, it keeps pushing the values of the box into the this.state.box array, and it 'remembers' those values because it's in the same array that we later on, in 'FaceRecognition', map over to generate the box lines and so when we change URL (image), yes it will generate new boxes for the faces of the new picture, BUT it will also show the old boxes of the old faces of the old picture because the old values of the old boxes are still in the this.state.box array.
      // so how do we make sure that every time we click detect, it's a fresh empty array that we're pushing the values in and mapping over to generate the face boxes?
    }

    return boxArray;
    // after we looped and pushed the values of the box into the array 'this.state.box' (i.e. [0] (index 0) has bottomRow: 100, leftCol: 50, rightCol: 150, topRow: 200, then [1] ... for as many 'faces' as it detects) we want to return it
  };

  displayFaceBox = boxValue => {
    console.log(boxValue);
    this.setState({ box: boxValue });
  };

  onInputChange = event => {
    // we receive an argument here so we need a parameter to accept the argument, in this case we have an 'onChange' event listener where it listens to when the <input> tag (in 'ImageLinkForm.js') is changed, run the 'onInputChange' function which is to change the state of input: event.target.value (where event.target.value is whatever the input value is).
    // When we copy and paste a URL link in the input box, it will trigger the 'onChange' event listener and pass the URL (argument) to the event (parameter).
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.DEMOGRAPHICS_MODEL, this.state.input)
      .then(response =>
        this.displayFaceBox(this.calculateFaceLocation(response)),
      )
      .catch(err => console.log(err));
    // .then(                         // check the breakdown of the nested object
    //   function(response) {
    //     console.log(response);
    //   }
    // )
    // console.log('characteristics', response.outputs[0].data.regions[0].data.face);
    // console.log('face box', response.outputs[0].data.regions[0].region_info.bounding_box);
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <div className="main-center">
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition
            box={this.state.box}
            imageUrl={this.state.imageUrl}
          />
        </div>
      </div>
    );
  }
}

// all the yellow tags are 'components/child' of the parent 'App' and the purple tags (besides className) are 'props/data' that are passed down to child components
// for example 'FaceRecognition' component has a 'box' prop which is {this.state.box}, in this case, the values that are passed are the values of the box (columns and rows) generated from the loop in calculateFaceLocation
// so if we check the 'FaceRecognition' component

export default App;

// (1) since onInputChange is a part of the 'App' class, to access it, we need to do 'this.onInputChange' because onInputChange is a property of the 'App'
