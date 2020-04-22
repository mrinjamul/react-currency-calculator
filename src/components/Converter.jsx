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
    if (this.state.fromCurrency !== this.state.toCurrency) {
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
      this.setState({ result: "You can't convert the same currency!" });
    }
  };
  toconvertHandler = () => {
    if (this.state.fromCurrency !== this.state.toCurrency) {
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
    } else {
      this.setState({ amount: "You can't convert the same currency!" });
    }
  };

  selectHandler = (event) => {
    if (event.target.name === "from") {
      this.setState({ fromCurrency: event.target.value });
    }
    if (event.target.name === "to") {
      this.setState({ toCurrency: event.target.value });
    }
  };

  // handleSwap = () => {
  //   let oldcurrency = this.state.fromCurrency;
  //   this.setState({ fromCurrency: this.state.toCurrency });
  //   this.setState({ toCurrency: oldcurrency });
  // };

  handleSwap = () => {
    let oldcurrency = this.state.amount;
    this.setState({ amount: this.state.result });
    this.setState({ result: oldcurrency });
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
            onChange={(event) => this.setState({ amount: event.target.value })}
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
          <button onClick={this.convertHandler}>Convert</button>
        </div>
        <div className="Form">
          <input
            name="result"
            type="text"
            value={this.state.result}
            onChange={(event) => this.setState({ result: event.target.value })}
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
          <button onClick={this.toconvertHandler}>Convert</button>
        </div>
        <div className="Form">
          <button onClick={this.handleSwap}>Swap</button>
        </div>
        {/* {this.state.result && <h3>{this.state.result}</h3>} */}
      </div>
    );
  }
}

export default Converter;
