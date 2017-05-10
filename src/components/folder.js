import React, { Component } from 'react';

export default class Folder extends Component {

	render() {
		return (
          <div id="home" className="folder">
            <div className="circle"><span className="icon icon-homeowner-ins"></span></div><p className="folder_name">Homeowners</p>
          </div>
		);
	}
}