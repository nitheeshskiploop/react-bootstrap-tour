import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      errorMsg: ""
    }
  }

  componentWillMount() {
    if (localStorage.getItem('jwt-token')) {
      window.location.href = "/dashboard";
    }
  }

  storeData(e) {
    e.preventDefault();
    let data = {
      email: this.refs.email.value,
      password: this.refs.password.value,
    };
    this.props.dispatch({
      type: 'LOGIN_DATA',
      payload: {
        email: this.refs.email.value,
        password: this.refs.password.value
      }
    });
    this.postReq(data);
    // window.location.href = "/dashboard"
  }

  postReq(data) {
    fetch("http://localhost:3001/api/login/", {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'POST'
    }).then(res => res.json())
      .then(result => {
        if (result.success) {
          localStorage.setItem('jwt-token', result.token);
          window.location.href = "/dashboard";
        } else {
          this.setState({ errorMsg: result.message })
          setTimeout(() => this.setState({ errorMsg: "" }), 5000);
        }
      })
      .catch(error => console.log(error));
  }

  showPassword = () => {
    var element = document.getElementById("password");
    if (element.type === "password") {
        element.type = "text";
    } else {
      element.type = "password";
    }
}

  render() {
    return (
      <div>
        <div className="header">
          <div className="container">
            <div className="row py-3">
              <div className="col-md-6">
                <a className="navbar-brand" href="#">
                  <img className="img-responsive header-logo" src="http://chai-india.org/wp-content/themes/CHAI_2016/assets/img/logo.png" alt="hospital-logo" />
                </a>
              </div>
              <div className="col-md-3 text-right">
                <span className="d-block text-danger">CALL US</span>
                <span className="d-block text-white">+91-9012345678</span>
                <span className="d-block text-white">+91-9012345678</span>
              </div>
              <div className="col-md-3 text-right">
                <a className="navbar-brand" href="#"><i className="fa fa-facebook" ></i></a>
                <a className="navbar-brand" href="#"><i className="fa fa-twitter" ></i></a>
                <a className="navbar-brand" href="#"><i className="fa fa-youtube" ></i></a>
              </div>
            </div>
          </div>
          <div className="banner-holder">
            <aside className="login-holder text-white">
              <h2 className="text-center my-4">Sign in</h2>
              <div className="m-5">
                <form onSubmit={this.storeData.bind(this)} ref="loginForm">
                  <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" ref="email" placeholder="Enter email" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" ref="password" placeholder="Password" required />
                    <div className="form-check pt-2">
                      <input className="form-check-input" onClick={this.showPassword} type="checkbox" id="showPassword" />
                      <label className="form-check-label" htmlFor="showPassword">Show Password</label>
                    </div>
                  </div>
                  <div className="">
                    <button type="submit" className="btn btn-primary my-3">Sign in</button>
                    {this.state.errorMsg && <div className="alert alert-danger" role="alert">{this.state.errorMsg}</div>}
                  </div>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state.loginReducer;
}

export default connect(mapStateToProps)(Login);