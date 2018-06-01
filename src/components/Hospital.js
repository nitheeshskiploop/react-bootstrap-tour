import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
// const products = require('../hospital.json');
import Tour from "bootstrap-tour";

class Hospital extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      temp: [],
      msg: ""

    }
  }

  componentWillMount() {
    (localStorage.getItem('jwt-token')) &&
      (fetch("http://localhost:3001/api/dashboard/hospitaldata", {
        method: 'POST',
        body: JSON.stringify({
          id: jwt.decode(localStorage.getItem('jwt-token'))._id
        }),
        headers: new Headers({
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json'
        }),
      }).then(res => res.json())
        .then(result => {
          // console.log("result", result);
          if (result.message === "token expired") {
            localStorage.removeItem("jwt-token");
            window.location.href = "/verifyToken"
          }
          this.setState({ products: result.data });
        })
        .catch(err => console.log(err)))
  }

  saveHospitalData() {
    const data = {
      question: this.refs.table.getTableDataIgnorePaging(),
      loginUser: {
        _id: jwt.decode(localStorage.getItem('jwt-token'))._id,
        email: jwt.decode(localStorage.getItem('jwt-token')).email
      }
    }
    fetch("http://localhost:3001/api/dashboard/storehospital", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: new Headers({
        'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
        "Content-Type": "application/json"
      })
    }).then(res => res.json())
      .then(result => {
        // console.log(result);
        this.setState({ msg: result.message });

        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
      })
      .catch(err => console.log(err));
  }

  removeToken() {
    localStorage.removeItem("jwt-token");
    window.location.href = "/";
  }

  onAfterSaveCell = (row) => {
    row.createdBy = jwt.decode(localStorage.getItem('jwt-token')).email;
    row.createdDate = Date();
    this.setState({ temp: [...this.state.temp, row] })
  }

  cellEditProp = {
    mode: "dbclick",
    blurToSave: true,
    afterSaveCell: this.onAfterSaveCell
  }

  signoutPopup = () => {
    let element = document.getElementById("signout");
    element.classList.toggle("signout-popup");
  }

  componentDidMount() {
    
  }

  render() {
    return (
      (localStorage.getItem('jwt-token')) ?
        <div>
          <div className="header">
            <div className="container">
              <div className="row py-3">
                <div className="col-md-6" id="popup1">
                  <a className="navbar-brand" href="#">
                    <img className="img-responsive header-logo" src="http://chai-india.org/wp-content/themes/CHAI_2016/assets/img/logo.png" alt="hospital-logo" />
                  </a>
                </div>
                <div className="col-md-3 text-right" id="popup2">
                  <span className="d-block text-danger">CALL US</span>
                  <span className="d-block text-white">+91-9012345678</span>
                  <span className="d-block text-white">+91-9012345678</span>
                </div>

                <div className="col-md-3 text-right" id="popup3">
                  <div className="row">
                    <div className="col-md social" id="social">
                      <a className="navbar-brand" href="#"><i className="fa fa-facebook" ></i></a>
                      <a className="navbar-brand" href="#"><i className="fa fa-twitter" ></i></a>
                      <a className="navbar-brand" href="#"><i className="fa fa-youtube" ></i></a>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md">
                      <button className="fa fa-user-circle-o user-icon" onClick={this.signoutPopup}></button>

                      <div className="card signout" id="signout">
                        <div className="card-body">
                          <p className="card-text">Hello! {jwt.decode(localStorage.getItem('jwt-token')).email}</p>
                          <button className="btn btn-outline-danger btn-sm float-right" onClick={this.removeToken.bind(this)}>Sign out</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row" >
              <div className="col-md" id="table">
                <BootstrapTable
                  data={this.state.products}
                  search={true}
                  multiColumnSearch={true}
                  cellEdit={this.cellEditProp}
                  striped
                  hover
                  height="430"
                  scrollTop={'Top'}
                  ref="table"
                >
                  <TableHeaderColumn isKey={true} dataField="serialNum" width="7%">Sl No</TableHeaderColumn>
                  <TableHeaderColumn dataField="itemDescription" editable={false}>Item Description</TableHeaderColumn>
                  <TableHeaderColumn dataField="brand" editable={false}>Brand</TableHeaderColumn>
                  <TableHeaderColumn dataField="model" editable={false}>Model</TableHeaderColumn>
                  <TableHeaderColumn dataField="value" width='15%' editable={{ type: 'number' }}>Quantity</TableHeaderColumn>
                </BootstrapTable>
                <button className="btn savebtn" onClick={this.saveHospitalData.bind(this)}>Save</button>
                <div id="snackbar">{this.state.msg}</div>
              </div>
            </div>
          </div>
        </div > : (<Redirect to="/" />)
    );
  }
}
export default Hospital;
