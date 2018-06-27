import React, { Component } from 'react';

import './css/pure-min.css'
import './App.css'

export default class VoteOption extends Component {

  constructor (props) {

    super(props);
    this.state = {
      optValue: 1,
    }
  }

  saveData = () => {
    this.props.onValueStore(this.props.id);

  }

  render() {
      return (
        <label className="radio"><input type="radio" name="opt" onChange={this.saveData} value={this.props.id}  /><span>{this.props.item}</span></label>          
//         <div className="l-box">
//             <legend>Select an Option</legend>
//            {this.props.showScore === "false"  &&
//                <label className="radio"><input type="radio" name="opt" onChange={this.saveData} value={this.props.id}  /><span>{this.props.item}</span></label>          
//            }
//           {this.props.showScore === "true"  &&
//              <tr>
//                <td>{this.props.item}</td>
//                <td>{this.props.score}</td>
//              </tr>
//            }
//         </div>

      );                
  }
}