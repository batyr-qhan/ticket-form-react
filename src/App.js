import React, { Component } from "react";
import "./App.css";

import {
  Icon,
  Button,
  Header,
  Checkbox,
  Form,
  Message,
  Divider,
} from "semantic-ui-react";

const options = [
  { key: "m", text: "Male", value: "male" },
  { key: "f", text: "Female", value: "female" },
  { key: "o", text: "Other", value: "other" },
];

class App extends Component {
  constructor(props) {
    super(props);
    // this.state = { inputs: ["input-0"] };
    this.state = {
      inputFields: [
        {
          firstName: "",
          lastName: "",
          gender: "",
          isCorporate: false,
          phone: "",
          isPhoneValid: false,
        },
      ],
      isCompleted: false,
    };
  }

  toggle = (event, data, i) => {
    const inputFieldsArray = this.state.inputFields;
    inputFieldsArray[i].isCorporate = !inputFieldsArray[i].isCorporate;
    this.setState(() => {
      return inputFieldsArray;
    });
  };

  handleInputChange = (index, event) => {
    const values = [...this.state.inputFields];
    if (event.target.name === "firstName") {
      values[index].firstName = event.target.value;
    } else if (event.target.name === "lastName") {
      values[index].lastName = event.target.value;
    } else values[index].phone = event.target.value;

    this.setState({
      inputFields: values,
    });
  };

  handleSelectChange = (index, { value }) => {
    const values = [...this.state.inputFields];
    values[index].gender = value;

    this.setState({
      inputFields: values,
    });
  };

  handleAddFields = () => {
    const values = [...this.state.inputFields];
    values.push({
      firstName: "",
      lastName: "",
      gender: "",
      isCorporate: false,
      phone: "",
    });

    this.setState({
      inputFields: values,
    });
  };

  handleRemoveFields = (index) => {
    const values = [...this.state.inputFields];
    values.splice(index, 1);

    this.setState({
      inputFields: values,
    });
  };

  isFormValid = () => {
    for (let i = 0; i < this.state.inputFields.length; i++) {
      if (
        this.state.inputFields[i].firstName === "" ||
        this.state.inputFields[i].lastName === "" ||
        this.state.inputFields[i].gender === ""
      ) {
        return true;
      }
    }
  };

  isPhoneValid(i, e) {
    const inputFieldsArray = this.state.inputFields;

    let result;
    var term = e.target.value;
    var re = new RegExp("^([(+7)]+([0-9]){10})$");
    if (re.test(term)) {
      result = false;
    } else {
      result = "Пожалуйста, введите номер в формате +7**********";
    }

    inputFieldsArray[i].isPhoneValid = result;

    this.setState({
      inputFields: inputFieldsArray,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const url = "https://webhook.site/1cc27b86-6e29-4555-bd6f-209bcd09761c";

    const data = this.state.inputFields;

    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      // headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => console.log("Success:", response));
  };

  isFirstForm() {
    if (this.state.inputFields.length === 1) {
      return true;
    } else return false;
  }

  render() {
    const isEnabled = this.isFormValid();

    return (
      <div className="App">
        <Form onSubmit={this.handleSubmit} success>
          <div id="dynamicInput">
            {this.state.inputFields.map((inputField, index) => (
              <div key={index}>
                <div className="form-header">
                  <Header as="h3">Пассажир №{index + 1}</Header>
                  <div>
                    <Icon
                      disabled={this.isFirstForm()}
                      name="minus square"
                      color="red"
                      onClick={() => {
                        this.handleRemoveFields(index);
                      }}
                      size="large"
                    />
                    <Button
                      disabled={this.isFirstForm()}
                      onClick={() => {
                        this.handleRemoveFields(index);
                      }}
                    >
                      Удалить пассажира
                    </Button>
                  </div>
                </div>
                <div className="form-checkbox">
                  <Checkbox
                    label="Оформление билета по корпоративному талону"
                    onChange={(e, v) => this.toggle(e, v, index)}
                    checked={inputField.isCorporate}
                  />
                </div>
                <Form.Group unstackable widths={3}>
                  <Form.Field required>
                    <label>First Name</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                      value={inputField.firstName}
                      onChange={(event) => this.handleInputChange(index, event)}
                    />
                  </Form.Field>
                  <Form.Field required>
                    <label>Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                      value={inputField.lastName}
                      onChange={(event) => {
                        // console.log("sdf");
                        this.handleInputChange(index, event);
                      }}
                    />
                  </Form.Field>
                  <Form.Select
                    required
                    fluid
                    label="Gender"
                    name="gender"
                    options={options}
                    placeholder="Gender"
                    onChange={(e, { value }) =>
                      this.handleSelectChange(index, { value })
                    }
                  />
                </Form.Group>
                <Form.Group unstackable widths={3}>
                  <Form.Input
                    error={this.state.inputFields[index].isPhoneValid}
                    fluid
                    label="Phone"
                    placeholder="Phone"
                    name="phone"
                    onChange={(event) => {
                      this.handleInputChange(index, event);
                      this.isPhoneValid(index, event);
                    }}
                  />
                </Form.Group>
                <Divider style={{ margin: "24px 0px" }} />
              </div>
            ))}
          </div>

          <div className="addButton">
            <div>
              <Icon
                name="add square"
                color="red"
                onClick={this.handleAddFields}
                size="large"
              />
              <Button onClick={this.handleAddFields}>Добавить пассажира</Button>
            </div>
          </div>
          <div>
            {this.state.isCompleted ? (
              <Message
                success
                header="Форма заполнена"
                content="Ваши данные отправлены в формате JSON"
                style={{ margin: "24px 0px 0px 0px" }}
              />
            ) : null}

            <Divider style={{ margin: "24px 0px" }} />

            <Button
              color="red"
              type="submit"
              disabled={isEnabled}
              onClick={() => {
                this.setState({
                  isCompleted: true,
                });
              }}
            >
              Submit
            </Button>
          </div>
          <br />
          <pre>{JSON.stringify(this.state.inputFields, null, 2)}</pre>
        </Form>
      </div>
    );
  }
}

export default App;
