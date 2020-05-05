import React from 'react';
import { connect } from 'react-redux';


function USER(props) {
  const greeting = 'Hello Function Component!';
  return greeting;
}
const mapStateToProps = state => ({ 
  user: state.userReducer
})
export default connect(mapStateToProps)(USER)