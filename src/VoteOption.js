import React, { Component } from 'react';

export default class VoteOption extends Component {

  constructor (props) {

    super(props);
    this.state = {
      optValue: 1,
    }
  }

  validate = () => {
    this.props.onValueStore(this.props.id);

  }

  render() {
      return (
        <tr>
          <td>{this.props.item}</td>
          {this.props.showScore === "false"  &&
            <td>
              <input type="radio" name="opt" onChange={this.validate} value={this.props.id} />
            </td>
          }
          {this.props.showScore === "true"  &&
            <td>{this.props.score}</td>
          }

        </tr>
      );                
  }
}