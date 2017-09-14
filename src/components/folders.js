import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import DatePicker from "react-bootstrap-date-picker";
import {Modal, Button, FormGroup, FormControl, DropdownButton} from 'react-bootstrap';

const IconsList = (props) => {
	let icons = [];
	_.range(11).forEach((element) => {
		if(element < 10) {
			icons.push(<option key={element}>{String.fromCharCode("0xf00" + element)}</option>)
		} else {
			icons.push(<option key={element}>{String.fromCharCode("0xf0" + element)}</option>)
		}
		});

    return (
    <select className="form-control fontawesome-select">
		{
			icons
		}
    </select>
    )
}

const Selections = React.createClass({
  getInitialState() {
    var content = <FormControl type="text" placeholder="שם הקובץ" value={this.props.text}/>
    return {
      content: content,
      text: ""
    }
  },
  handelChange (event) {
    if(event.target.id == "tag") {
        let target = 
        <div><FormControl type="text" placeholder="שם התגית" value={this.state.text} onChange={this.props.content(this.state.text)}/>
        <br/>
	    	{this.props.tags.length ?(
	    		<DropdownButton title={this.props.tags[0].name} id="bg-nested-dropdown">
	    			{
	    			this.props.tags.map((tag, key) => {
	    				return (<MenuItem eventKey={key} key={key}>{tag.name}</MenuItem>)
	    				})
	    			}
	    		</DropdownButton>
	    	):(
	    		<DropdownButton title="אין תגיות קיימות!" id="bg-nested-dropdown" disabled>
	    			</DropdownButton>)}
                    </div>;
        this.setState({
            content:target
        })
    } else if(event.target.id == "date") {
        let target = <div style={{direction:"ltr"}}>
                <DatePicker placeholder="תאריך התחלה"/>
                <br/>
                <DatePicker placeholder="תאריך סיום"/>
                </div>;
        this.setState({
            content:target
        })
    } else {
        let target = <FormControl type="text" placeholder="שם הקובץ" value={this.props.text}/>;
        this.setState({
            content:target
        })
    }

    return ;
  },
    render() {
        return (
        <div>
            <br/>
                <div className="btn-group btn-group-justified" onClick={(event) => this.handelChange(event)} style={{direction:"ltr"}}>
                    <a className="btn btn-primary" id="tag">לפי תגית</a>
                    <a className="btn btn-info" id="date">לפי תאריך</a>
                    <a className="btn btn-success" id="name">לפי שם</a>
                </div>
                <br/>

                {this.state.content}
        </div>
        )
    }
})

export default class folders extends Component {
	constructor(props){
	super(props)
		this.state = {
			folders: [],
            showModal: false,
            showEditFolder:false,
            icon:"",
            folder:"",
            content:"",
            tags:[]
		}; 
	}
    componentDidMount() {
        axios.get(`/getFolders`)
        .then(res => {
            let folders = res.data.folders;
            let foldersOrdered = [];
            while(folders.length) {
                foldersOrdered.push(folders.splice(0,6))
            }
            this.setState({folders: foldersOrdered});
            this.props.foldersLength(this.state.folders.length)
        });
    }

    handleFolderNameChange(event) {
        this.setState({
        folder: event.target.value,
        });
    };

    handleIconNameChange(event) {
        this.setState({
        icon: event.target.value,
        });
    };
    
    handleContentNameChange(event) {
        this.setState({
        content: event.target.value,
        });
    }

    close() {
        this.setState({ showModal: false,
                        icon:"",
                        folder:"",
                        content:""});
    }

    open() {
        this.setState({ showModal: true });
    }

    handleSubmit(event) {
		axios.post('/saveFolder', 
                    {"name":this.state.folder,
                     "icon":this.state.icon,
                     "content": this.state.content})
		.then((response, scope = this) => {
            var newFolders = scope.state.folders;
            if(!newFolders.length) {
                newFolders.push([JSON.parse(response.config.data)]);
                scope.setState({folders: newFolders});
            } else {
                var isInserted = false;
                this.state.folders.map((item) => {
                    if(item.length < 6) {
                        item.push(JSON.parse(response.config.data));
                        isInserted = true;
                    }
                })
                if(!isInserted) {
                    newFolders.push([JSON.parse(response.config.data)]);
                }
            }
            scope.setState({folders: newFolders});
            this.props.foldersLength(this.state.folders.length)
			this.close();
            scope.forceUpdate()
          }
		);
    }

    closeEditFolder() {
        this.setState({ showEditFolder: false,
                        icon:"",
                        folder:"",
                        content:""});
    }

    openEditFolder(item) {
        this.setState({ showEditFolder: true,
                        icon:item.icon,
                        folder:item.name,
                        content:item.content});
    }

    handleUpdateFolder(folderID) {
		axios.post('/updateFolder', 
                    {"name":this.state.folder,
                     "icon":this.state.icon,
                     "content": this.state.content,
                     "folderID": folderID})
		.then((response, scope = this) => {
			this.closeEditFolder();
            this.forceUpdate()
            }
		);
    }

    handleDeleteFolder(folderID) {
		axios.post('/deleteFolder', 
                    {"folderID": folderID})
		.then((response, scope = this, id=folderID) => {
            var newFolders = scope.state.folders;
            // newFolders.map((folder) => {
            //     if(folder.id == id) {

            //     }
            // })

            var removeIndex = newFolders.map(function(item) { return item._id; })
                       .indexOf(id);
            removeIndex && newFolders.splice(removeIndex, 1);
            scope.setState({folders: newFolders});

			this.closeEditFolder();
            this.forceUpdate()
            }
		);
    }

    getFiles(event) {
        var folderContent = event.target.dataset.content;
		axios.post('/search', 
                    {"folderContent":folderContent})
		.then((response, scope = this) => {
            // var addFolder = scope.state.folders;
            // addFolder.push(JSON.parse(response.config.data))
            // scope.setState({folders: });
            scope.props.isFiles(response.data);
            }
		);
    }
    
    render() {
        return (
            <div>
            {
                this.state.folders.length ?(this.state.folders[this.props.index].map((item, key) => {
                var colors = ["#569cd5", "#a893c6", "#fcb116", "#f4815e", "#79c143", "#309fb0", "#cdcdcd" ]
                var color = colors[Math.floor(Math.random() * colors.length)]
                var style = {color: color, borderColor: color}
                var folderClass = "fa fa-" + item.icon + " fa5 folderIcon"
                return(
                    <div key={key}>
                    {this.props.userData ? (	
					this.props.userData.isAdmin ? (
                        <i className="fa fa-pencil-square-o fa-2 editFolder" aria-hidden="true" onClick={() => this.openEditFolder(item)}></i>) 
                        : (<div></div>)) 
                    : (<div></div>)}
                    <div className="folderSize" onClick={(event) => this.getFiles(event)}>
                    <div className="folderCircle" style={style}>
                        <i className={folderClass} aria-hidden="true">
                        </i>
                        <span className="iconFolder" data-content={item.content}>{item.name}</span>
                    </div>
                    <Modal show={this.state.showEditFolder} onHide={this.closeEditFolder.bind(this)} className="rightDialog">
                    <Modal.Header closeButton>
                        <Modal.Title>עריכת תיקיה קיימת</Modal.Title>
                    </Modal.Header>
                    {/* <Modal.Body>
                    <form>
                        <FormGroup>
                        <FormControl type="text" placeholder="שם התיקיה" value={this.state.folder} onChange={this.handleFolderNameChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup>
                        <FormControl type="text" placeholder="אייקון" value={this.state.icon} onChange={this.handleIconNameChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup>
                        <FormControl type="text" placeholder="תוכן התיקיה" value={this.state.content} onChange={this.handleContentNameChange.bind(this)}/>
                        </FormGroup>
                    </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" id="deleteBtn" onClick={() => this.handleDeleteFolder(item._id)}>מחק</Button>
                        <Button bsStyle="success" onClick={() => this.handleUpdateFolder(item._id)}>שמור</Button>
                    </Modal.Footer> */}
                    <Selections/>
                    </Modal>
                    </div>
                    </div>
                    )
                })) : 
                    (<div></div>)
            }
            {this.props.userData ? (
					this.props.userData.isAdmin ? 
                    (
                        <div className="folderSize">
                        <div className="folderCircle">
                            <i className="fa fa-plus-circle fa5 folderIcon" aria-hidden="true" onClick={this.open.bind(this)}>
                            </i>
                        <Modal show={this.state.showModal} onHide={this.close.bind(this)} className="rightDialog">
                        <Modal.Header closeButton>
                            <Modal.Title>יצירת תיקיה חדשה</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <form>
                            <FormGroup>
                            <FormControl type="text" placeholder="שם התיקיה" value={this.state.folder} onChange={this.handleFolderNameChange.bind(this)}/>
                            </FormGroup>
                            <FormGroup>
                            <IconsList/>
                            </FormGroup>
                            {/* <FormGroup>
                            <Selections content= {this.handleContentNameChange} tags = {this.state.tags}/>
                            </FormGroup> */}
                        </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button bsStyle="success" id="saveBtn" onClick={this.handleSubmit.bind(this)}>שמור</Button>
                        </Modal.Footer>
                        </Modal>
                        </div>
                        </div>
                    )
                        : 
                        (<div></div>) 
                        ) : 
                        (
                          <div></div>  
                        )}
            </div>
        )
    }
}