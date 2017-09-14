import React, { Component, PropTypes } from 'react'
import onClickOutside from 'react-onclickoutside'
import {Checkbox} from 'react-bootstrap';
import axios from 'axios';

export default onClickOutside(class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {isSearchOpen: false}
    }
    componentDidMount() {
        var search = document.getElementsByClassName("navbar-nav")[0];
        search.addEventListener('click', (event, scope = this) => {
            if (!scope.state.isSearchOpen) {
                    scope.setState({isSearchOpen: true})
                    document.body.style.background = "rgba(204, 204, 204, 0.42)"
                    document.getElementsByClassName("search")[0].style.display = "block"
                    console.log(scope.state.isSearchOpen)
                } else {
                    scope.handleClickOutside(event)
                    console.log(scope.state.isSearchOpen)
                }
        });
    }
    handleClickOutside(evt) {
        this.setState({isSearchOpen:false})
		document.body.style.background = "white"
		document.getElementsByClassName("search")[0].style.display = "none"
  	}
    update_list(event, tagName) {
            axios.post('/search', 
                        {"fileName":tagName})
            .then((response, scope = this) => {
                scope.props.isFiles(response.data);
                console.log("got files")
                }
            );
    }
    render() {
        return <div className="searchBox">
                    <input className="main-search-btn" value="חפש" type="submit" onClick={(event) => this.update_list(event, document.getElementsByClassName("main-search-box")[0].value)}/>
                    <input className="main-search-box"
                        type="text" onKeyDown={(event) => {if(event.keyCode == 13) {this.update_list(event, document.getElementsByClassName("main-search-box")[0].value)}}}/>
                <div className="search">
                <div className="search-box"><input id="sec-search" type="text" className="form-control" onKeyDown={(event) => {if(event.keyCode == 13) {this.update_list(event, document.getElementById("sec-search").value); this.handleClickOutside()}}}/>
                    <button type="submit" className="btn btn-default" onClick={() => {this.update_list(event, document.getElementById("sec-search").value); this.handleClickOutside()}}>חפש</button>
                </div>
            </div>
        </div>
    }
})