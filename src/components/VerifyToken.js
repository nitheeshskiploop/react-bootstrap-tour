import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class VerifyToken extends Component {

  render() {
    return (
      <div className="container text-center registration-container">
        <div className="row">
          <div className="col"></div>
          <div className="col-md-6">
            <div className="card border-dark">
              <h4 className="card-header">Session Expired</h4>
              <div className="card-body">
                <p>click <Link to="/">here</Link> to login again</p>
              </div>
            </div>
          </div>
          <div className="col"></div>
        </div>
      </div>
    )
  }
}

export default VerifyToken;
