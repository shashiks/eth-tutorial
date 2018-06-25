import React, { Component } from 'react';
import contract from 'truffle-contract';
import votingContract from '../build/contracts/Voting.json';
import VoteOption from './VoteOption.js';

import './css/pure-min.css'
import './App.css'


var voting = contract(votingContract);
var me = null;


class App extends Component {

	constructor (props) {
		super(props);
		this.state = {
			options: '',
			totalOptionsCount : '',
			selectedOpt: -1,
			isOptData : false,
			txnId : '',
			results: '',
			view: 'create',
			optNames: [],
		}
		me = this;
	}

	componentDidMount() {
		voting.setProvider(window.web3.currentProvider);
	}


	addOption = () => {
		let currUser = window.web3.eth.defaultAccount;
		let option = this.refs.optName.value;

		try {
			voting.deployed().then(function(instance) {
				// console.log("Instance " + instance.address);
				instance.addOption.sendTransaction(option, {gas:3000000,from: currUser}).then(function(txnHash) {
					me.setState({txnId: txnHash});
				});
			});
			
			} catch (err) {
				console.error("Err loading options count  "+ err);
				return;
			}
	}


	initOptionList = () => {
		me.setState({isOptData: false});
		var tmpNames = [];
		voting.deployed().then(function(instance) {
				instance.optionsCount.call().then( function(optCount) {
					
					let v = optCount.toString();
					me.setState({totalOptionsCount : v});
					for(let i = 0 ; i < optCount; i++) {
						instance.getOptionAt.call(i).then(function(optInfo) {
							tmpNames.push( i+ "," + optInfo);
							if(i == (optCount-1)){
								me.setState({isOptData: true});
								me.setState({optNames: tmpNames});
							}
						});
					} 
			});
		});
}

	vote = () => {
		let optId = this.state.selectedOpt;
		let currUser = window.web3.eth.defaultAccount;
		
		voting.deployed().then(function(instance) {
			try {
				instance.vote.sendTransaction(optId, {gas:3000000, from: currUser}).then( function(txnHash) {
					me.setState({txnId: txnHash});
				});
			} catch (err) {
				console.error("Err voting  "+ err);
				return;
			}
		});
	}

  optionValueStore(optionId) {
			me.setState({selectedOpt: optionId});
	}

	eachOption = (row, index) => {
		let info = row.split(",");
		return ( 
			<VoteOption showScore="false" id={info[0]} item={info[1]} key={info[0]} onValueStore={this.optionValueStore}/>
		);
	}

	eachScore = (row, index) => {
		let info = row.split(",");
		return ( 
			<VoteOption showScore="true" score={info[2]} id={info[0]} item={info[1]} key={info[0]} onValueStore={this.optionValueStore}/>
		);
	}

	
	render() {

		return (
			<div className="App">
		        <nav className="navbar pure-menu pure-menu-horizontal">
		            <a href="#" className="pure-menu-heading pure-menu-link">Voting dApp</a>
		        </nav>

		        <main className="container">
		          <div className="pure-g">
		            <div className="pure-u-1-1">
		              <h2>Smart Contract Example</h2>
		              <table>
										<tbody>
		              	<tr>
											<td><a onClick={ () => { this.setState({txnId : ''}); this.setState({view : 'create'}) } }>Add Option</a></td>
		              		<td><a onClick={ () => {this.setState({txnId : ''}); this.initOptionList(); this.setState({view : 'vote'})   } }>Show Options</a></td>
											<td><a onClick={ () => { this.setState({txnId : ''}); this.initOptionList(); this.setState({view : 'result'}) } }>View Results</a></td>
		              	</tr>
										{this.state.view === 'create' && 										
											<tr>
												<td>Option Name</td>
												<td><input type="text" ref="optName"  />{this.state.txnId}</td>
												<td><a onClick={ () => { this.addOption() } }>save</a></td>
											</tr>
										}
										{this.state.view === 'vote' && this.state.isOptData && 
											<tr>
												<table>
													<tbody>
														<tr>
															{this.state.optNames.map(this.eachOption)}
														</tr>
														<tr>
															<td><a onClick={ () => { this.vote() } }>Vote</a></td>
															<td>{this.state.txnId}</td>
														</tr>
													</tbody>
													</table>
											</tr>
										}
										{this.state.view === 'result' && 
												<tr>
													{this.state.optNames.map(this.eachScore)}
												</tr>
										}
										</tbody>
								 </table>		              	

		            </div>
		          </div>
		        </main>
		      </div>			

		);

	}

}

export default App;