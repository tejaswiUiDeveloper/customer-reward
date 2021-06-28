import React from "react";
import {Route, withRouter} from 'react-router-dom';
import { DATASET } from "../data/Data";
import "./AllRewards.css";
import Customer from "./CustomerReward";

class Reward extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.getCustomerData(DATASET);
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

  getCustomerData = (data) => {
    const customers = Array.from([
      ...new Set(data.map((transaction) => transaction.id)),
    ]).map((custId) => {
      const transactionData = data.filter(
        (transaction) => transaction.id === custId
      );
      return {
        id: custId,
        name: data.find((transaction) => transaction.id === custId).name,
        spent: transactionData.reduce((sum, current) => {
          return sum + current.amount;
        }, 0),
        rewards: transactionData.reduce((sum, current) => {
          return sum + this.totalRewards(current.amount);
        }, 0),
      };
    });
    this.setState(() => {
      return { customers: customers };
    });
  };

  tableData = () => {
    return this.state.customers.map((customer, key) => {
      const { id, name, spent, rewards } = customer;
      return (
        <tr key={id} onClick = {() => this.getCustomerRewardPoints(id, name)}>
          <td>{id}</td>
          <td>{name}</td>
          <td>$ {spent}</td>
          <td>{rewards} points</td>
        </tr>
      );
    });
  };

  tableHeader = (data) => {
    if (data.length > 0) {
      let header = Object.keys(data[0]);
      return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>;
      });
    }
  };

  getCustomerRewardPoints = (id, name) => {
    this.props.history.push({
      pathname: "/" + id,
      search: name,
    });
  };

  render() {
    if (!this.state.customers) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <h1>Customers Reward Points</h1>
        <table id="rewards">
          <tbody>
            <tr>{this.tableHeader(this.state.customers)}</tr>
            {this.tableData()}
          </tbody>
        </table>
        <Route path="/:customerId" exact component={Customer}/>
      </div>
    );
  }
}

export default withRouter(Reward);
