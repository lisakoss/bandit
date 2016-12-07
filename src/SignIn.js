import React from 'react';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import './index.css';
import { Textfield, Button } from 'react-mdl';

/**
 * A form for logging into a website.
 * Specifies email and password.
 * Expects `signUpCallback` and `signInCallback` props
 */
class SignInForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      'email': undefined,
      'password': undefined
    }; 

    //function binding
    this.handleChange = this.handleChange.bind(this);

  }

  //update state for specific field
  handleChange(event) {
    var field = event.target.name;
    var value = event.target.value;

    var changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
  }


  //handle signIn button
  signIn(event) {
    event.preventDefault(); //don't submit
    this.props.signInCallback(this.state.email, this.state.password);
  }

  /**
   * A helper function to validate a value based on a hash of validations
   * second parameter has format e.g., 
   * {required: true, minLength: 5, email: true}
   * (for required field, with min length of 5, and valid email)
   */
  validate(value, validations) {
    var errors = {isValid: true, style:''};
    
    if(value !== undefined) { //check validations
      if(validations.required && value === '') {
        errors.required = true;
        errors.isValid = false;
      }

      if(validations.minLength && value.length < validations.minLength) {
        errors.minLength = validations.minLength;
        errors.isValid = false;
      }

      //handle email type
      if(validations.email) {
        //pattern comparison from w3c
        //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
        var valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
        if(!valid) {
          errors.email = true;
          errors.isValid = false;
        }
      }
    }

    //display details
    if(!errors.isValid){ //if found errors
      errors.style = 'has-error';
      
    }
    else if(value !== undefined){ //valid and has input
      //errors.style = 'has-success' //show success coloring
    }
    else { //valid and no input
      errors.isValid = false; //make false anyway
    }
    return errors; //return data object
  }

  render() {
    //field validation
    var emailErrors = this.validate(this.state.email, {required:true, email:true});
    var passwordErrors = this.validate(this.state.password, {required:true, minLength:8});

    //button validation
    var signInEnabled = (emailErrors.isValid && passwordErrors.isValid);

    return (
      <div role="article">
        <h1>sign in</h1>

        <form role="form" className="sign-up-form">

          <ValidatedInput field="email" type="email" label="your email address" changeCallback={this.handleChange} errors={emailErrors} />

          <ValidatedInput field="password" type="password" label="your password" changeCallback={this.handleChange} errors={passwordErrors} />

          <div className="form-group sign-up-buttons">
            <p><Button raised accent ripple disabled={!signInEnabled} onClick={(e) => this.signIn(e)}>Sign In</Button></p>
            <p>Don't have an account yet? <a href="/#/signup">Sign Up!</a></p>
          </div>
        </form>
      </div>
    );
  }
}

//to enforce proptype declaration
SignInForm.propTypes = {
  signInCallback: React.PropTypes.func.isRequired
};


//A component that displays an input form with validation styling
//props are: field, type, label, changeCallback, errors
class ValidatedInput extends React.Component {
  render() {
    return (
      <div className={"form-group "+this.props.errors.style}>
        <Textfield
          onChange={this.props.changeCallback}
          label={this.props.label}
          id={this.props.field}
          type={this.props.type}
          name={this.props.field}
          floatingLabel
        />
        <ValidationErrors errors={this.props.errors} />
      </div>
    );
  }  
}

//a component to represent and display validation errors
class ValidationErrors extends React.Component {
  render() {
    return (
      <div role="region">
        {this.props.errors.required &&
          <span className="help-block">Required! </span>
        }
        {this.props.errors.email &&
          <span className="help-block">Not an email address!</span>
        }
        {this.props.errors.minLength &&
          <span className="help-block">Must be at least {this.props.errors.minLength} character(s).</span>        
        } 
      </div>
    );
  }
}

export default SignInForm;