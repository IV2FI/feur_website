import React from 'react';
import Landing from './Landing';
import Stats from './Stats';
import Latest from './Latest';
import Footer from './Footer';

class App extends React.Component
{

  render ()
  {

    return (

      <div className="flex flex-col min-h-screen dark:bg-gray-900">

        <Landing/>

        <Stats/>

        <Latest/>

        <Footer/>

        
      </div>
    
    );
  }
}

export default App;