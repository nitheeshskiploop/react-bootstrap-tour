import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Registration extends Component {
  constructor() {
    super();
    this.state = {
      isValidPass: false,
      isValidConfPass: false,
    }
  }

  storeData(e) {
    e.preventDefault();
    let data = {
      "email": this.refs.email.value,
      "password": this.refs.password.value,
      "hospital": this.refs.hospital.value
    }
    // console.log(data)

    if (this.refs.confirmPassword.value.length < 8 || (this.refs.password.value !== this.refs.confirmPassword.value)) {
      this.setState({ isValidConfPass: true })
    } else {
      this.setState({ isValidConfPass: false });
      this.postReq(data);
    }

    this.props.dispatch({
      type: 'REGISTRATION_DATA',
      payload: {
        email: this.refs.email.value,
        password: this.refs.password.value,
        hospital: this.refs.hospital.value
      }
    })
  }
  postReq(data) {
    fetch("http://localhost:3001/api/registration/", {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'POST'
    }).then(res => res.json())
      .then(data => {
        if (data.success) {
          this.setState({ mailExistMsg: data.message })
          setTimeout(() => this.setState({ mailExistMsg: "" }), 5000);
        } else {
          this.setState({ succesMsg: `${data.message}, Confirmation mail has been sent to your mail` })
          setTimeout(() => this.setState({ succesMsg: "" }), 5000);
          this.refs.registrationForm.reset();
        }
      })
      .catch(err => console.log(err));
  }


  validatePass(e) {
    console.log(this.refs.password.value)
    if (this.refs.password.value === '') {
      this.setState({ isValidPass1: false, isValidPass2: false, isValidPass3: false });
    } else if (this.refs.password.value.length < 8) {
      this.setState({
        isValidPass1: true, isValidPass2: false, isValidPass3: false
      })
    } else if (!this.refs.password.value.match(/[A-Z]/)) {
      this.setState({
        isValidPass2: true, isValidPass3: false, isValidPass1: false
      })
    } else if (!this.refs.password.value.match(/[0-9]/)) {
      this.setState({
        isValidPass3: true, isValidPass1: false, isValidPass2: false
      })
      // } else if (!this.refs.password.value.match(/[@._-]/)) {
      //   this.setState({
      //     isValidPass4: true
      //   })
    } else {
      this.setState({
        isValidPass1: false, isValidPass2: false, isValidPass3: false, isValidPass4: false
      })
    }
  }
  validateConfPass(e) {
    if (this.refs.confirmPassword.value !== '') {
      this.setState({ isValidConfPass: false });
    } else this.setState({ isValidConfPass: false });
  }

  render() {
    return (
      <div className="container text-center registration-container">
        <div className="row">
          <div className="col"></div>
          <div className="col-md-6">
            <div className="card border-dark">
              <h4 className="card-header">Registration</h4>
              <div className="card-body">

                <form onSubmit={this.storeData.bind(this)} ref="registrationForm">
                  <div className="form-group row">
                    <label htmlFor="email" className="col-sm-4 col-form-label">Email</label>
                    <div className="col-sm-8">
                      <input type="email" className="form-control" id="email" ref="email" placeholder="Email" required />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label htmlFor="password" className="col-sm-4 col-form-label">Password</label>
                    <div className="col-sm-8">
                      <input type="password" className="form-control" id="password" ref="password" placeholder="Password" required onChange={this.validatePass.bind(this)} />
                      {this.state.isValidPass1 && <div className="alert alert-danger" role="alert">Password must atleast 8 characters!</div>}
                      {this.state.isValidPass2 && <div className="alert alert-danger" role="alert"> - atleast 1 uppercase!</div>}
                      {this.state.isValidPass3 && <div className="alert alert-danger" role="alert"> - atleast 1 number!</div>}
                      {/* {this.state.isValidPass3 && <div className="alert alert-danger" role="alert">password must atleast 1 speccial characters(@ . _ -)</div>} */}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label htmlFor="confirmPassword" className="col-sm-4 col-form-label">Confirm Password</label>
                    <div className="col-sm-8">
                      <input type="password" className="form-control" id="confirmPassword" ref="confirmPassword" placeholder="Confirm Password" required onChange={this.validateConfPass.bind(this)} />
                      {this.state.isValidConfPass && <div className="alert alert-danger" role="alert">Password didn't match!</div>}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label htmlFor="hospital" className="col-sm-4 col-form-label">Hospital</label>
                    <div className="col-sm-8">
                      <input type="text" className="form-control" id="hospital" ref="hospital" placeholder="Hospital" required />
                    </div>
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary">Register</button>
                  </div>
                </form>

              </div>
            </div><br />
            <p className="text-body">Already have account? Login <Link to="/"> Here</Link></p>
            <p><a href="http://localhost:3001/api/registration/auth/google"><button className="btn btn-primary text-white"><span className="fa fa-google pr-5"></span>Register with Google</button></a></p>
            {this.state.mailExistMsg && <div className="alert alert-danger" role="alert">{this.state.mailExistMsg}</div>}
            {this.state.succesMsg && <div className="alert alert-success" role="alert">{this.state.succesMsg}</div>}
          </div>
          <div className="col"></div>

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state.registrationReducer;
}

export default connect(mapStateToProps)(Registration);