import React , {Component} from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import Search from './search';
import Folder from './folder';
import Folders from './folders';
import {Nav, NavItem} from 'react-bootstrap';

var globalIndex = 0;
var length = 0;

export default class FoldersList extends Component {
	constructor(props){
	super(props)
		this.state = {
			isFolder: true,
			files: [],
			search: [],
			first:[]
		}; 
	}

   componentDidMount() {
    // axios.get(`http://localhost:3000/getFiles`)
    //   .then(res => {
    //     const files = res.data.slice(0,12);
	// 	const sortedFiles = [];
	// 	while(files.length) {
	// 		sortedFiles.push(files.splice(0,6));
	// 		}
    //     this.setState({ files: sortedFiles, 
	// 					search : sortedFiles});
    //   });

    var nextClick = document.getElementsByClassName("slick-next")[0];
    nextClick.addEventListener('click', (event) => {
        if(globalIndex != length - 1) {
			globalIndex = globalIndex + 1;
		}
        this.forceUpdate()
    });
    var prevClick = document.getElementsByClassName("slick-prev")[0];
    prevClick.addEventListener('click' , (event) => {
        if(globalIndex != 0) {
            globalIndex = globalIndex - 1
        }
        this.forceUpdate()
    });
   }

   getFolderFiles(folderFiles, numOFiles = 3) {
	   	globalIndex = 0;
	   	this.setState({isFolder: false,
					   first : Array.from(folderFiles)})
		let files = folderFiles;
		let sortedFiles = [];
		if(numOFiles != 3) {
			let reFiles = [];
			for (let item of files) {
				reFiles = reFiles.concat(item)
			}
			files = reFiles
		}

		while(files.length) {
			sortedFiles.push(files.splice(0,numOFiles));
		}
		length = sortedFiles.length;
        this.setState({ files: sortedFiles,
						search : sortedFiles});
   }

   showFolders() {
	   globalIndex = 0
	   this.setState({isFolder: true})
   }

   foldersLength(currLength) {
	length = currLength;
   }
   
   changeHandler(e) {
	 this.getFolderFiles(this.state.first, e.target.value)
   }
	
	render(){
	var settings = {
      dots: true,
      infinite: false,
    };
		return (
            <div className="content-box">
			<Search list_data={this.state.files} isFiles={this.getFolderFiles.bind(this)}/>
			<div className='container'>
				{this.props.userData ? (
					this.props.userData.isAdmin ? (
						<Nav bsStyle="pills" activeKey="1">
							<NavItem>קבצים</NavItem>
							<NavItem eventKey="1" onClick={this.showFolders.bind(this)}>תיקיות</NavItem>
						</Nav>) :
						(
							!this.state.isFolder ?(<Nav bsStyle="pills" activeKey="1">
									<NavItem eventKey="1" onClick={this.showFolders.bind(this)}>תיקיות</NavItem>
							</Nav>)	:
							(
								<div></div>
							)
					)
				):
				(
					!this.state.isFolder ?(<Nav bsStyle="pills" activeKey="1">
							<NavItem eventKey="1" onClick={this.showFolders.bind(this)}>תיקיות</NavItem>
					</Nav>)	:
					(
						<div></div>
					)
				)}
			{!this.state.isFolder ? <input onChange={(e) => this.changeHandler(e)} defaultValue={3} type='range' min={3} max={6} style={{direction: "rtl"}}/>:(<div/>)}
			<Slider ref='slider' {...settings}>
				<div>
				{ this.state.isFolder ? (<Folders index={globalIndex} 
												  foldersLength={this.foldersLength.bind(this)}
												  isFiles={this.getFolderFiles.bind(this)}
												  userData={this.props.userData}/>)
												  
					: 
					(this.state.search.map((item) => {
					return(item.map((item, index) => {
							return (
										<Folder key={item.id} data={item} isFiles={this.getFolderFiles.bind(this)} userData={this.props.userData}/>
								)
					}))
				})[globalIndex])}
				</div>
			</Slider>
			</div>
			</div>
		)

	}

}