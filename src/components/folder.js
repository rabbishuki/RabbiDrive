import React, { Component } from 'react';
import axios from 'axios';
import Search from './search'
import {Modal, Button, FormGroup, FormControl, DropdownButton, MenuItem} from 'react-bootstrap';

export default class Folder extends Component {
	constructor(props){
	super(props)
		this.state = {
			showAddTag: false,
			tag: "",
			tags:[]
		}; 
	}
	
    closeAddTag() {
        this.setState({ showAddTag: false,
                        tag:""});
    }

    openAddTag() {
        this.setState({ showAddTag: true });
        axios.get(`/getTags`)
        .then(res => {
            this.setState({tags: res.data.tags});
        });
		this.forceUpdate()
    }

	handleAddTag(event) {
        this.setState({
        tag: event.target.value,
        });
    };

    handleSubmit(fileID, tagName) {
		axios.post('/addTag', {"fileId":fileID, "tagVal":tagName})
		.then(function(response){
			console.log('saved successfully')
		});
	}

	getFolderFiles(id) {
		axios.post('/search', {"folderId":id})
		.then((response,  scope = this) => {
			scope.props.isFiles(response.data);
		});
	}

	render() {
		let { id, name , mimeType, iconLink} = this.props.data;
		let link = "https://drive.google.com/open?id=" + id;
		return (
			<div className="folder">
				{mimeType && mimeType.includes("vnd.google-apps.folder") ? 
				(<div className="circle" onClick={() => this.getFolderFiles(id)}>
						<span >
							<img className="fileIcon" src = {iconLink} />
						</span>
					</div>) 
				: (
					 <a href={link}>
					<div className="circle">
						<span>
							<img className="fileIcon" src = {iconLink} />
						</span>
					</div>
				</a>
				)}
				<span className="folder_desc">{name}</span>

				{this.props.userData ? (	
					this.props.userData.isAdmin ? (
						<div className="add-button">
							<div className="sub-button tr" onClick={this.openAddTag.bind(this)}></div>
							<Modal show={this.state.showAddTag} onHide={this.closeAddTag.bind(this)} className="rightDialog">
							<Modal.Header closeButton>
								<Modal.Title>הוספת תגית לקובץ</Modal.Title>
							</Modal.Header>
							<Modal.Body>
							<form>
								<FormGroup>
								<FormControl type="text" placeholder="שם תגית" value={this.state.tag} onChange={this.handleAddTag.bind(this)}/>
								</FormGroup>
								{this.state.tags.length ?(
									<DropdownButton title={this.state.tags[0].name} id="bg-nested-dropdown">
										{
										this.state.tags.map((tag, key) => {
											return (<MenuItem eventKey={key} key={key}>{tag.name}</MenuItem>)
											})
										}
									</DropdownButton>
								):(
									<DropdownButton title="אין תגיות קיימות!" id="bg-nested-dropdown">
										</DropdownButton>)}
							</form>
							</Modal.Body>
							<Modal.Footer>
								<Button bsStyle="success" id="saveBtn" onClick={() => this.handleSubmit(id, this.state.tag)}>שמור</Button>
							</Modal.Footer>
							</Modal>
						</div>
					) : (
						<div></div>
                    )) 
					: (
						<div></div>
					)}
			</div>
		);
	}
}