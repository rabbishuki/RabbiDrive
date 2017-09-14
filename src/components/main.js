import React, { Component } from 'react';
import FoldersList from './foldersList';
import NavBar from './navBar';
import axios from 'axios';

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
			userName: {}
		}; 
  }

  componentDidMount() {
      axios.get(`/getUserInfo`)
      .then(res => {
          this.setState({userName: res.data.username});
      });
  }

  render() {
    return (
      <div className="app">
        <NavBar userData={this.state.userName}/>
	<div className="main-content">
	    <img src="style/logo.png" width="25%"/>
	    <p>ארכיון גאולה ומשיח הוא מאגר אינטרנטי המרכז חומר מגוון בעניני גאולה ומשיח, הכולל ספרים חוברות
		ופרסומים בעניני גאולה ומשיח, ומגוון חומרי הפצה והסברה.</p>
	    <p>מטרת הארכיון הינה להנגיש את החומר שיצא לאור לכלל הציבור, ולהוסיף בפעולות להפצת בשורת הגאולה,
		ובלימוד עיוני של עניני גאולה ומשיח.</p>
	    <div className="btn-group btn-group-justified">
		<a className="btn btn-success">לתרומות</a>
		<a className="btn btn-info">צור קשר</a>
		<a className="btn btn-primary">מי אנחנו</a>
	    </div>
	</div>
        <div>
          <FoldersList className="top-list" userData={this.state.userName}/>
        </div>
	<div className="footer">
    		<h3>יחי אדוננו מורנו ורבינו מלך המשיח לעולם ועד</h3>
	</div>
      </div>
    )
  }
}
