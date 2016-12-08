import React from 'react';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import './index.css';
import { Textfield, Button } from 'react-mdl';

/**
 * A form for signing up for a website.
 * Specifies email, password, and display name.
 * Expects `signUpCallback` and `signInCallback` props
 */
class SignUpForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      'email': undefined,
      'password': undefined,
      'displayName': undefined,
      'passwordConfirm': undefined,
      'avatar': ''
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

  //handle signUp button
  signUp(event) {
    event.preventDefault(); //don't submit
    this.props.signUpCallback(this.state.email, this.state.password, this.state.displayName, this.state.avatar);
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
      //display name required
      if(validations.required && value === '') {
        errors.required = true;
        errors.isValid = false;
      }

      //display name minLength
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

      // handle password confirmation
      if(validations.match) {
        if(this.state.password !== this.state.passwordConfirm) {
          errors.match = true;
          errors.isValid = false;
        }
      }
    }

    //display details
    if(!errors.isValid){ //if found errors
      errors.style = 'has-error';

    }
    else if(value !== undefined){ //valid and has input

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
    var displayNameErrors = this.validate(this.state.displayName, {required:true, minLength:1});
    var passwordConfirmErrors = this.validate(this.state.password, {required: true, match: true})

    //button validation
    var signUpEnabled = (emailErrors.isValid && passwordErrors.isValid && displayNameErrors.isValid && passwordConfirmErrors.isValid);

    return (
      <div role="article">
        <h1>sign up</h1>

        <form role="form" className="sign-up-form">

          <ValidatedInput field="email" type="email" label="your email address" changeCallback={this.handleChange} errors={emailErrors} />

          <ValidatedInput field="displayName" type="text" label="your name" changeCallback={this.handleChange} errors={displayNameErrors} />

          <ValidatedInput field="password" type="password" label="your password" changeCallback={this.handleChange} errors={passwordErrors} />

          <ValidatedInput field="passwordConfirm" type="password" label="confirm your password" changeCallback={this.handleChange} errors={passwordConfirmErrors} />

          {/* full html for the URL (because image) */}
          <div className="avatar-field">
            <img className="avatar" src={this.state.avatar || './img/blank-user.jpg'} alt="avatar preview" />
            <Textfield
              onChange={this.handleChange}
              label="Avatar Image URL"
              id="avatar"
              type="text"
              name="avatar"
              placeholder="http://www.test.com/picture.jpg"
              floatingLabel
              style={{width:"245px"}}
            />
          </div>

          <div className="form-group sign-up-buttons">
            <p><Button raised accent ripple disabled={!signUpEnabled} onClick={(e) => this.signUp(e)}>Sign Up</Button></p>
            <p>Already have an account? <a href="/login">Sign In!</a></p>
          </div>
        </form>
      </div>
    );
  }
}

//to enforce proptype declaration
SignUpForm.propTypes = {
  signUpCallback: React.PropTypes.func.isRequired,
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
        {this.props.errors.match &&
          <span className="help-block">Your passwords don't match!</span>
        }
      </div>
    );
  }
}

export default SignUpForm;
