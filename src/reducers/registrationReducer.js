const registrationReducer = (state = {
  email: "",
  password: "",
  hospital: ""
}, action) => {
  switch (action.type) {
    case 'REGISTRATION_DATA': return {
      ...state,
      email: action.payload.email,
      password: action.payload.password,
      hospital: action.payload.hospital
    }
    case 'REGISTRATION_WITH_G_DATA': return {
      ...state,
      email: action.payload.email,
      hospital: action.payload.hospital
    }
    default: return state
  }
}

export default registrationReducer;