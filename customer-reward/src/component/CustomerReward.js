import React, { Component } from "react";
import { DATASET } from "../data/Data";
import "./AllRewards.css";

class Customer extends Component {
  state = {
    data: [],
    customerData: [],
    isMonthlyDataClicked: false,
    month: "",
  };

  componentDidMount() {
    console.log(this.props.match.params.customerId);
    this.customerData(this.props.match.params.customerId);
  }

  totalRewards = (amount) => {
    let rewardPoints = 0;
    if (amount >= 100) {
      rewardPoints = 2 * (amount - 100) + 50;
    }
    if (amount > 50 && amount <= 100) {
      rewardPoints += amount - 50;
    }
    return rewardPoints;
  };

  tableHeader = (data) => {
    if (data.length > 0) {
      let header = Object.keys(data[0]);
      return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>;
      });
    }
  };

  customerData = (customerId) => {
    const customerData = DATASET.filter(
      (transaction) => transaction.id === parseInt(customerId)
    );
    this.setState(() => {
      return { customerData: customerData };
    });
    const customerMonthsData = Array.from([
      ...new Set(
        customerData.map((transaction) =>
          transaction.transactionDt.toLocaleString("default", { month: "long" })
        )
      ),
    ]).map((mon) => {
      const custData = customerData.filter((transaction) => {
        return (
          transaction.transactionDt.toLocaleString("default", {
            month: "long",
          }) === mon
        );
      });
      return {
        month: mon,
        spent: custData.reduce((sum, current) => {
          return sum + current.amount;
        }, 0),
        'Total Rewards': custData.reduce((sum, current) => {
          return sum + this.totalRewards(current.amount);
        }, 0),
      };
    });
    this.setState(() => {
      return { data: customerMonthsData };
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.match.params.customerId !== this.props.match.params.customerId
    ) {
      this.customerData(this.props.match.params.customerId);
      this.setState(() => {
        return { isMonthlyDataClicked: false };
      });
    }
    if (prevState.month !== this.state.month) {
      this.customerData(this.props.match.params.customerId);
    }
  }

  tableData = () => {
    return this.state.data.map((dt, key) => {
      const { month, spent, 'Total Rewards': totalRewards } = dt;
      return (
        <tr key={month}>
          <td>{month}</td>
          <td>$ {spent}</td>
          <td>{totalRewards} points</td>
        </tr>
      );
    });
  };

  render() {
    const name = this.props.location.search.slice(1);
    console.log(this.state.data)
    return (
      <div>
        <h1>Reward points of {name}</h1>
        <table id="rewards">
          <tbody>
            <tr>{this.tableHeader(this.state.data)}</tr>
            {this.tableData()}
          </tbody>
        </table>
      </div>
    );
  }
}
export default Customer;
