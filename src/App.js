import React, {Component} from 'react';
import Navigation from './Components/Navigation/Navigation';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import './App.css';
import Clarifai from 'clarifai';

const app1 = new Clarifai.App({
  apiKey: 'c3f7f71b13ff47028fafe871f0c30c77'
});

const particlesOptions ={
  particles:{
    number:{
      value:50,
      density:{
        enable:true,
        value_area:800
      }
    }
}
} 

class App extends Component{
  constructor(){
    super()
    this.state={
      input:'',
      imageUrl:'',
      box:{},
      route: 'signin',
      isSignedIn:false
    }
  }

  calculateFaceLocation=(data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)  
    }
  }

displayFaceBox = (box) => {
  console.log(box)
  this.setState({box: box})
}
  
onInputChange=(event)=>{
  this.setState({input: event.target.value});
}
onButtonSubmit=()=>{
  this.setState({imageUrl: this.state.input});
  console.log(this.state.input);
  app1.models.predict(
    Clarifai.FACE_DETECT_MODEL, this.state.input)
  .then(response =>
    this.displayFaceBox(this.calculateFaceLocation(response)))
  .catch(err  => console.log(err)); 
}
onRouteChange=(route)=>{
  if (route === 'signout'){
    this.setState({isSignedIn:false})
  }
  else if(route === 'home'){
    this.setState({isSignedIn:true})
  }
  this.setState({route:route}); 
}

  render() {
    const {isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation 
        isSignedIn={isSignedIn}
        onRouteChange={this.onRouteChange}/>
        {route === 'home' ?
        <div>
          <Logo /> 
          <Rank />
          <ImageLinkForm 
            onButtonSubmit={this.onButtonSubmit}
            onInputChange={this.onInputChange}
          /> 
          <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div> :
        ( route === 'signin'
        ? <SignIn onRouteChange={this.onRouteChange}/> 
        : <Register onRouteChange={this.onRouteChange}/> 
        )
        }
      </div>
    );
  }
}

export default App;
