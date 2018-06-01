import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class VerifyUser extends Component {
  constructor() {
    super();
    this.state = {
      isVerified: false,
      isVerified1: false,
      msg: ""
    }
  }

  componentWillMount() {
    console.log(this.props.userId)
    fetch(`http://localhost:3001/api/registration/verifyUser/${this.props.userId}`, {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'PUT'
    }).then(res => res.json())
      .then(data => {
        if (data.success) {
          this.setState({ isVerified: true, msg: data.message })
        } else {
          this.setState({ isVerified: true, msg: data.message })
        }
      })
  }

  render() {
    return (
      <div className="container text-center registration-container">
        <div className="row">
          <div className="col"></div>
          {this.state.isVerified &&
            <div className="col-md-6">
              <div className="card border-dark">
                <h4 className="card-header">Email Verification</h4>
                <div className="card-body">
                  <h1>{this.state.msg}</h1>
                  <span>click <Link to="/"> here</Link> to login</span>
                </div>
              </div>
            </div>}
          <div className="col"></div>
        </div>
      </div>
    )
  }
}

export default VerifyUser;