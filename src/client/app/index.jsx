import React from 'react';
import {render} from 'react-dom';
import {Folder} from './components/folder.js'

class App extends React.Component {
  render () {
    return <div>
      <p> Hello React!</p>
      <Folder/>
      </div>;
  }
}

render(<App/>, document.getElementById('app'));