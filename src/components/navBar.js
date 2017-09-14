import axios from 'axios';
import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside'
import {Navbar, NavItem} from 'react-bootstrap';
import Search from './search';

export default class navBar extends Component {
	constructor(props){
        super(props)
	}
    
    render() {
        return (<div>
            <nav className="navbar navbar-toggleable-md navbar-inverse bg-primary">
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
		  <ul className="header">ארכיון גאולה ומשיח</ul>
		  <ul className="navbar-nav">
                        <li className="nav-item">
                       		<a className="nav-link" href="#"><i className="fa fa-search"></i></a>		
                 	</li>		
                 </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            {this.props.userData ? (
                                <div className="nav-link"> <span className="nav-text">{this.props.userData.displayName} </span><i className="fa fa-user-circle-o"></i></div>
                            ) : (
                                <a className="nav-link" href="/auth/google"><i className="fa fa-user-circle-o"></i></a>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>
        </div>);
    }
}