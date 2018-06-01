import React, { Component } from 'react';
import { connect } from 'react-redux';

class RegisterWithGoogle extends Component {
  constructor() {
    super();
    this.state = {
      isHospital: false
    }
  }

  componentWillMount() {
    // fetch(`http://localhost:3001/api/registration/${this.props.userId}`, {
    //   headers: new Headers({
    //     'Authorization': 'Bearer' + ' ' + localStorage.getItem('jwt-token'),
    //     'Content-Type': 'application/json'
    //   }),
    //   method: 'GET'
    // }).then(res => res.json())
    //   .then(data => {
    //     this.setState({data: data[0]})
    //   })
    // this.setState({ isHospital: true })
    // console.log("cookie in props", this.props)
    // const { cookies } = this.props;
    // console.log(cookies)
    // console.log("document.cookie", document.cookie);
    // // console.log("cookie.get", Cookies.get("jwt"));    
    if (document.cookie) {
      console.log("if in reg with google")
      localStorage.setItem('jwt-token', document.cookie.split('=')[1]);
      window.location.href = '/dashboard';
    }
  }

  storeData(e) {
    e.preventDefault();
    let data = {
      "hospital": this.refs.hospital.value
    }
    this.putReq(data);
  }
  putReq(data) {
    fetch(`http://localhost:3001/api/registration/${this.props.userId}`, {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'PUT'
    }).then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('jwt-token', data.token);
          // localStorage.setItem('jwt-token',document.cookie.split('=')[1])
          this.setState({ msg: data.message })
          // setTimeout(() => this.setState({ toRedirect: true }), 2000)
          this.setState({ isLoading: true })
          setTimeout(() => {
            window.location.href = "/dashboard"
          }, 2000);
        } else {
          this.setState({ msg: data.message })
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      (this.props.userId) &&
      (<div className="container text-center registration-container">
        <div className="row">
          <div className="col"></div>
          <div className="col-md-6">
            <div className="card border-dark">
              <h4 className="card-header">One more step</h4>
              <div className="card-body">
                <form onSubmit={this.storeData.bind(this)} ref="registrationForm">
                  <div className="form-group row">
                    <label htmlFor="hospital" className="col-sm-4 col-form-label">Hospital</label>
                    <div className="col-sm-8">
                      <input type="text" className="form-control" id="hospital" ref="hospital" placeholder="Hospital" required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">Register</button><br />
                  {this.state.isLoading && <img className="w-25" src="https://cdn.dribbble.com/users/359314/screenshots/2379673/untitled-3.gif" alt="Cinque Terre" />}
                </form>
              </div>
            </div>
            {this.state.msg && <div className="alert alert-success" role="alert">{this.state.msg}</div>}
          </div>
          <div className="col"></div>
        </div>
      </div>)
    )
  }
}

const mapStateToProps = (state) => {
  return state.registrationReducer;
}

export default connect(mapStateToProps)(RegisterWithGoogle);