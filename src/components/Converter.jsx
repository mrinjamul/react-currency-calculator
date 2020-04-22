import React, { Component } from "react";
import axios from "axios";

import "./Converter.css";

class Converter extends Component {
  state = {
    result: 1,
    fromCurrency: "USD",
    toCurrency: "INR",
    amount: 1,
    currencies: [],
    isTrue: true,
  };

  componentDidMount() {
    axios
      .get("https://api.exchangerate-api.com/v4/latest/USD")
      .then((response) => {
        const currencyAr = [];
        for (const key in response.data.rates) {
          currencyAr.push(key);
        }
        this.setState({ currencies: currencyAr.sort() });
      })
      .catch((err) => {
        console.log("Opps", err.message);
      });
  }

  convertHandler = () => {
    if (this.state.isTrue === true) {
      axios
        .get(
          `https://api.exchangerate-api.com/v4/latest/EUR?base=${this.state.fromCurrency}`
        )
        .then((response) => {
          const result =
            this.state.amount * response.data.rates[this.state.toCurrency];
          this.setState({ result: result.toFixed(5) });
        })
        .catch((err) => {
          console.log("Opps", err.message);
        });
    } else {
      axios
        .get(
          `https://api.exchangerate-api.com/v4/latest/EUR?base=${this.state.toCurrency}`
        )
        .then((response) => {
          const amount =
            this.state.result * response.data.rates[this.state.fromCurrency];
          this.setState({ amount: amount.toFixed(5) });
        })
        .catch((err) => {
          console.log("Opps", err.message);
        });
    }
  };

  selectHandler = (event) => {
    if (event.target.name === "from") {
      this.setState({ fromCurrency: event.target.value, isTrue: true });
    }
    if (event.target.name === "to") {
      this.setState({ toCurrency: event.target.value, isTrue: false });
    }
  };

  // handleSwap = () => {
  //   let oldcurrency = this.state.fromCurrency;
  //   this.setState({ fromCurrency: this.state.toCurrency });
  //   this.setState({ toCurrency: oldcurrency });
  // };

  handleSwap = () => {
    this.setState({ isTrue: true });
    let oldcurrency = this.state.amount;
    this.setState({ amount: this.state.result });
    this.setState({ result: oldcurrency });
  };

  handleChange = (event) => {
    this.setState({ amount: event.target.value });
    this.setState({ isTrue: true });
  };

  tohandleChange = (event) => {
    this.setState({ result: event.target.value });
    this.setState({ isTrue: false });
  };
  handleClear = () => {
    this.setState({
      result: 1,
      amount: 1,
      isTrue: true,
    });
  };

  render() {
    return (
      <div className="Converter">
        <h2>
          <span>Currency </span> Converter{" "}
        </h2>
        <div className="Form">
          <input
            name="amount"
            type="text"
            value={this.state.amount}
            onChange={(event) => this.handleChange(event)}
          />
          <select
            name="from"
            onChange={(event) => this.selectHandler(event)}
            value={this.state.fromCurrency}
          >
            {this.state.currencies.map((cur) => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
        </div>
        <div className="Form">
          <input
            name="result"
            type="text"
            value={this.state.result}
            onChange={(event) => this.tohandleChange(event)}
          />
          <select
            name="to"
            onChange={(event) => this.selectHandler(event)}
            value={this.state.toCurrency}
          >
            {this.state.currencies.map((cur) => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
        </div>
        <br />
        <div className="Form">
          <button onClick={this.handleClear}>Clear</button>
          <span>&nbsp;</span>
          <button onClick={this.handleSwap}>Swap</button>
          <span>&nbsp;</span>
          <button onClick={this.convertHandler}>Convert</button>
        </div>
        {/* {this.state.result && <h3>{this.state.result}</h3>} */}
      </div>
    );
  }
}

export default Converter;
