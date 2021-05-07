import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

var currencies = []  
currencies.push ({
    name: "US Dollar",
    abbreviation: "USD",
  },
  {
    name: "Canadian Dollar",
    abbreviation: "CAD",
  },
  {
    name: "Indonesian Rupiah",
    abbreviation: "IDR",
  },
  {
    name: "British Pound",
    abbreviation: "GBP",
  },
  {
    name: "Swiss Franc",
    abbreviation: "CHF",
  },
  {
    name: "Singapore Dollar",
    abbreviation: "SGD",
  },
  {
    name: "Indian Rupee",
    abbreviation: "INR",
  },
  {
    name: "Malaysian Ringgit",
    abbreviation: "MYR",
  },
  {
    name: "Japanese Yen",
    abbreviation: "JPY",
  },
  {
    name: "Korean Won",
    abbreviation: "KRW",
  },)
var currencyItems = [];
let usdAmount = 1;
currencyItems.push({
  index: 1,
  name: "Canadian Dollar",
  abbreviation: "CAD",
  rate: 1.4693,
});

class CurrencyList extends React.Component {
  render() {
    var items = this.props.items.map((item, index) => {
      return (
        <CurrencyListItem
          key={index}
          item={item}
          index={index}
          removeItem={this.props.removeItem}
        />
      );
    });
    return <ul className="list-group"> {items} </ul>;
  }
}

class CurrencyListItem extends React.Component {
  constructor(props) {
    super(props);
    this.onClickClose = this.onClickClose.bind(this);
  }
  onClickClose() {
    var index = parseInt(this.props.index);
    this.props.removeItem(index);
  }
  render() {
    return (
      <li className="list-group-item ">
        <div>
          <Row>
            <Col> {this.props.item.abbreviation}</Col>
            <Col>{this.props.item.value}</Col>
          </Row>
          <Row>
            {this.props.item.abbreviation} - {this.props.item.name}
          </Row>
          <Row>
            1 USD = {this.props.item.abbreviation} {this.props.item.rate}{" "}
          </Row>
          <button type="button" className="close" onClick={this.onClickClose}>
            &times;
          </button>
        </div>
      </li>
    );
  }
}

class CurrencyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "KRW" };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }
  onSubmit(event) {
    event.preventDefault();
    var newItemValue = this.state.value;

    if (newItemValue) {
      this.props.addItem({ newItemValue });
      this.refs.form.reset();
    }
  }
  render() {
    return (
      <form ref="form" onSubmit={this.onSubmit} className="form-inline">
        <select value={this.state.value} onChange={this.onChange}>
          {currencies.map((currency) => (
            <option value={currency.abbreviation}>
              {currency.abbreviation}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-default">
          Submit
        </button>
      </form>
    );
  }
}

class CurrencyApp extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.state = { currencyItems: currencyItems, baseAmount: usdAmount };
  }
  addItem(currencyItem) {
    const selectedCurrency = currencyItem.newItemValue;
    const result = currencies.find(
      ({ abbreviation }) => abbreviation === selectedCurrency
    );
    currencyItems.push({
      index: currencyItems.length + 1,
      name: result.name,
      abbreviation: result.abbreviation,
      rate: result.rate,
      value: result.rate * usdAmount,
    });
    this.setState({ currencyItems: currencyItems });
  }
  removeItem(itemIndex) {
    currencyItems.splice(itemIndex, 1);
    this.setState({ currencyItems: currencyItems });
  }
  render() {
    return (
      <div>
        <CurrencyList
          items={this.props.initItems}
          removeItem={this.removeItem}
        />
        <CurrencyForm addItem={this.addItem} />
      </div>
    );
  }
}

class BaseCurrencyInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { usdAmount: 1 };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = (e) => {
    this.props.onAmountChange(e.target.value);
    this.setState({ usdAmount: e.target.value });
  };
  render() {
    return (
      <div>
        <form>
          <input
            value={this.props.usdAmount}
            onChange={this.handleChange}
          ></input>
        </form>
      </div>
    );
  }
}



export default class CurrencyCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = { usdAmount: 1 };
    this.state = { currencies: currencies };
  }

  componentDidMount() {
    this.fetchCurrency();
  }

  fetchCurrency = () => {
    axios
      .get(
        "http://api.exchangeratesapi.io/v1/latest?access_key=fc2a8d8d7287ded199a00216c798a580&format=1"
      )
      .then((data) => {
        currencies.forEach(
          (currency) => (currency.rate = data.rates[currency.abbreviation])
        );
        this.setState({ currencies: currencies });
      });
  };

  amountChanged = (val) => {
    this.setState({ usdAmount: val });
  };
  render() {
    return (
      <div>
        <Container>
          <Card border="dark" className="currency-card">
            <Card.Header>
              <Row>
                <h5>
                  <i>USD - United States Dollars</i>
                </h5>
              </Row>
              <Row>
                <Col md="auto">
                  <h3>USD</h3>
                </Col>
                <Col md="auto">
                  <BaseCurrencyInput onAmountChange={this.amountChanged} />
                  {/* <InputGroup>
                  <FormControl
                    mb="3"
                    placeholder="10.00"
                    aria-label="Base Currency"
                  />
                </InputGroup> */}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <CurrencyApp
                initItems={currencyItems}
                baseAmount={this.state.usdAmount}
                currencies={currencies}
              />
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }
}
