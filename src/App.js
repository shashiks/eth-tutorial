import React, { Component } from 'react';
import contract from 'truffle-contract';
import votingContract from '../build/contracts/Voting.json';
import Web3 from 'web3';

import './css/pure-min.css'
import './App.css'


var voting = contract(votingContract);
var me = null;
var web3 = window.web3;

class App extends Component {

	constructor (props) {
		super(props);
		this.state = {
			selectedOpt: -1,
			isOptData : false,
			txnId : '',
			results: '',
			view: 'create',
			optNames: [],
			resultMsg : ''
		}
		me = this;
		
	}

	componentDidMount() {
		web3 = new Web3(web3.currentProvider)
		voting.setProvider(web3.currentProvider);
	}

	addOption = () => {
		let currUser = window.web3.eth.defaultAccount;
		let option = this.refs.optName.value;
		try {
			voting.deployed().then(function(instance) {
				// console.log("Instance " + instance.address);
				instance.addOption.sendTransaction(option, {gas:3000000,from: currUser}).then(function(txnHash) {
					me.setState({txnId : "Transaction Id : " + txnHash});
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
					me.setState({txnId : "Transaction Id : " +  txnHash});
				});
			} catch (err) {
				console.error("Err voting  "+ err);
				return;
			}
		});
	}

	getReceipt = () => {
		var v = this.refs.txnRefId.value;
		web3.eth.getTransactionReceipt(v, function(err, receipt){
			var txnMsg = "Status : ";
			if(receipt.status === "0x1") { //success
				txnMsg = "Sucess </br>";
			}
			if(receipt.status === "0x0") { //failure
				txnMsg = "Failure </br>";
			}
			if(!receipt.status) { //unknown
				txnMsg = "Unknown Failure </br>";
			}
			txnMsg += "Block Id : " + receipt.blockHash + "</br>";
			txnMsg += "Total gas used : " + receipt.cumulativeGasUsed;

			me.setState({resultMsg: txnMsg});
		});
	}

  optionValueStore(event) {
		event.stopPropagation();
		me.setState({selectedOpt: event.target.value});
	}

	eachOption = (row, index) => {
		let info = row.split(",");
		return (

			<div class="pure-control-group">
				<input type="radio" key={info[0]} id="opt" name="opt" onChange={this.optionValueStore} value={info[0]}  />
				<label htmlFor="opt">{info[1]}</label>
			</div>

		);
	}

	eachScore = (row, index) => {
		let info = row.split(",");
		return ( <tr><td>{info[1]}</td><td>{info[2]}</td></tr> );
	}

	clear = () => {
		this.setState({txnId : ''});
		this.setState({resultMsg : ''});
	}

	

	render() {
		return (
			<div className="App">
                <main className="container">
                    <div className="l-box">
                        <div className="pure-u-1">
                            <h2>Ethereum Voting dApp</h2>
                        </div>  
                    </div>
					 <div className="l-box">
                        <div className="pure-u-1" align="center">   
                          <div dangerouslySetInnerHTML={{__html: this.state.txnId}} />
                           <div dangerouslySetInnerHTML={{__html: this.state.resultMsg}} />                 
                        </div>  
                    </div>
                        <div className="pure-g">
                            <div className="pure-u-1-5"> 
                                <div className="pure-u-1">
                                        <div className="l-box"><a className="pure-menu-link" onClick={ () => { this.clear(); this.setState({view : 'create'}) } }>Add Option</a></div>
                                        <div className="l-box"><a className="pure-menu-link" onClick={ () => {this.clear(); this.initOptionList(); this.setState({view : 'vote'})}}>Vote</a></div>
                                        <div className="l-box"><a className="pure-menu-link" onClick={ () => { this.clear(); this.setState({view : 'result'})}}>View Scores</a> </div>
                                        <div className="l-box"><a className="pure-menu-link" onClick={ () => { this.initOptionList(); this.setState({view : 'receipt'}) } }>Check Status</a></div>
                                </div>
                            </div>
							<div className="pure-u-4-5"> 
								<div className="pure-u-1">
									{this.state.view === 'create' &&
                                                <form className="pure-form pure-form-stacked">
													<fieldset>
														<legend>Add new Option</legend>
														<input ref="optName" placeholder="Option Name" />
														<button type="button" className="pure-button pure-button-primary" onClick={ () => { this.addOption()}}>Add</button>
														<button type="reset" className="pure-button">Cancel</button>
													</fieldset>
												</form>
                                     }
									{this.state.view === 'vote' && this.state.isOptData && 
                                                <form className="pure-form pure-form-aligned">
													<fieldset>
														<div className="l-box">
															<legend>Select an Option</legend>{this.state.optNames.map(this.eachOption)}
														</div>
														<div className="l-box">
														<button onClick={() => { this.vote()}} type="button" className="pure-button pure-button-primary">Vote</button>
														<button type="submit" className="pure-button">Cancel</button>
														</div>
													</fieldset>
												</form>
                                        }
										{this.state.view === 'result' &&
											<form className="pure-form pure-form-stacked">
												<fieldset>
												<legend>Ballot Scores</legend>
													<table className="pure-table pure-table-horizontal">
														<thead>
															<tr>
																<th>Option</th>
																<th>Score</th>
															</tr>
														</thead>
														<tbody>{this.state.optNames.map(this.eachScore)}</tbody>
													</table>
												</fieldset>
											</form>
										}
										{this.state.view === 'receipt' &&
										 <form className="pure-form pure-form-stacked">
											<fieldset>
												<legend>View Transaction Status</legend>
												<input ref="txnRefId" placeholder="Transaction Id" />
												<button type="button" className="pure-button pure-button-primary" onClick={ () => { this.getReceipt()}}>Lookup</button>
												<button type="reset" className="pure-button">Cancel</button>
											</fieldset>
										</form>
										}										
								</div>
							</div>	
                        </div>
                </main> 
            </div>  
		);
	}
}

export default App;