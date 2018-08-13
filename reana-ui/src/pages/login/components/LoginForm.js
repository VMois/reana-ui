/*
	-*- coding: utf-8 -*-

	This file is part of REANA.
	Copyright (C) 2018 CERN.

	REANA is free software; you can redistribute it and/or modify it under the
	terms of the GNU General Public License as published by the Free Software
	Foundation; either version 2 of the License, or (at your option) any later
	version.

	REANA is distributed in the hope that it will be useful, but WITHOUT ANY
	WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
	A PARTICULAR PURPOSE. See the GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with REANA; if not, see <http://www.gnu.org/licenses>.

	In applying this license, CERN does not waive the privileges and immunities
	granted to it by virtue of its status as an Intergovernmental Organization or
	submit itself to any jurisdiction.
*/

import axios from "axios";
import React, { Component } from "react";
import history from "../../../history";
import {
  Button,
  Divider,
  Form,
  Grid,
  Image,
  Message,
  Segment
} from "semantic-ui-react";

import LogoImg from "../../../images/logo-reana.svg";
import Config from "../../../config";
import State from "../../../state";

export default class LoginForm extends Component {
  /**
   * Variables defining the state of the components
   */
  constructor(props) {
    super(props);
    this.state = {
      input_email: "",
      input_token: "",
      show_message: false
    };
  }

  /**
   * Updates state variables given user input
   */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  /**
   * Handling submit button
   */
  handleSubmit = () => {
    const { input_email, input_token } = this.state;

    axios({
      method: "post",
      url: Config.api + "/auth",
      headers: {
        "Content-type": "application/json"
      },
      data: {
        username: input_email,
        password: input_token
      }
    })
      .then(res => {
        this.setState({ show_message: false });
        State.login.user_token = input_token;
        State.login.jwt_token = res.data["access_token"];
        history.push("/workflows");
      })
      .catch(error => {
        this.setState({ show_message: true });
      });
  };

  render() {
    const { input_email, input_token, show_message } = this.state;
    return (
      <div className="login-form">
        <Grid
          textAlign="center"
          style={{ height: "100%" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Image centered spaced src={LogoImg} size="small" />
            <Divider />
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail"
                  name="input_email"
                  value={input_email}
                  onChange={this.handleChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Token"
                  name="input_token"
                  value={input_token}
                  onChange={this.handleChange}
                  type="password"
                />

                <Button color="blue" fluid size="large">
                  Login
                </Button>
                <Message
                  visible={show_message}
                  error
                  header="Invalid user / token"
                  content="Please introduce a valid user and token"
                />
              </Segment>
            </Form>
            <Message>
              New to us? <a href="mailto:info@reana.io">Ask for a token</a>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
