import React, { Component } from 'react';
//import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'
import web3 from '../ethereum/web3'
import contrato_solidity from '../abis/AdvancedStorage.json'


class App extends Component {
  async componentWillMount(){
    //Cargar de Web3.0
    await this.loadWeb3()
     // Carga de los datos de la Blockchain
     await this.loadBlockchainData()

  }
  //Cargar la web3.0
  async loadWeb3(){
    if(window.ethereum) {
      window.web3 = new Web3 (window.ethereum);
  try {
      await window.ethereum.request({method: "eth_requestAccounts"})
  } catch(error){
      alert('User denied account access...')
      }
  }
  else {
      alert('Non-Ethereum browser detected. You should trying Metamask!');
  }
  }

    // Carga de los datos de la Blockchain
    async loadBlockchainData() {
      const web3 = window.web3
      // Carga de la cuenta
      const accounts = await web3.eth.getAccounts()
      this.setState({account: accounts[0]})
      console.log('account', this.state.account)
      //Obtener el balance de la cuenta
      const balance = await web3.eth.getBalance(accounts[0])
      console.log(balance)
      this.setState({balance:web3.utils.fromWei(balance,'ether')})
      //Establecer el id de la red
      const networkId = '5777' // Rinkeby -> 4 , Ganache -> 5777, Emerald ->42261, matic->80001
      console.log('networkId: ', networkId)
      const networkData = contrato_solidity.networks[networkId]
      console.log('networkData: ', networkData)
      
      //Si estamos conectados a una red
      if(networkData) {
        //Obtener el abi.
        const abi = contrato_solidity.abi
        console.log('abi', abi)
        //Obtener la dirección
        const address = networkData.address
        console.log('address', address)
        //Obtener la dirección del contrato
        const contract = new web3.eth.Contract(abi, address)
        this.setState({contract})
        //Obtener todos los numeros
        const get_data = await this.state.contract.methods.getAll().call()
        this.setState({Get_Data: get_data})
        console.log('Numeros:', get_data.toString())
        //Obtener cuantos numeros hay introducidos.
        const length = (await this.state.contract.methods.length().call()).toString()
        this.setState({Length: length})
        console.log('Cuantos numeros:', length)
      } else {
        //Alerta de no tener ningún smart contract desplegado en la red.
        window.alert('¡El Smart Contract no se ha desplegado en la red!')
      }
    }

  //Constructor de las variables.
  constructor(props){
    super(props)
    this.state ={
      account: '',
      contract: null,
      balance:'',
      loading:false,
      Get_Data: [],
      Length:'',
      get_id:'No has solicitado ningún numero'
    }
  }

    // Funcion para añadir un numero
    add = async (data, mensaje) => {
      try{
        console.log(mensaje)
        const accounts = await web3.eth.getAccounts()
        // añadir un numero
        await this.state.contract.methods.add(data).send({from: accounts[0]})
      }catch(err){
        this.setState({errorMessage: err.message})
      } finally{
        this.setState({loading: false})
      }
    }

        // Funcion para obtener un numero en concreto
        get = async (id, mensaje) => {
          try{
            console.log(mensaje)
            // obtener numero
            const ids= await this.state.contract.methods.get(id).call()
            this.setState({get_id: ids})
            alert(parseFloat(ids))
          }catch(err){
            this.setState({errorMessage: err.message})
          } finally{
            this.setState({loading: false})
          }
        }
  

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://www.youtube.com/channel/UCfspyHKd_MkUamR5OFNByfA"
            target="_blank"
            rel="noopener noreferrer"
          >
            DApp AdvancedStorage
          </a>
          <ul className='navbar-nav-px-3'>
            <li className='nav-item text-nowrap d-none d-sm-non d-sm-block'>
              <small className='text-white'><span id="Account">Account: {this.state.account}</span></small>
            </li>
            <li className='nav-item text-nowrap d-none d-sm-non d-sm-block'>
              <small className='text-white'><span id="Account">Balance: {this.state.balance} ETH</span></small>
            </li>

          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              &nbsp;
                <h1>DApp - AdvancedStorage</h1>

&nbsp;

<h4> Numeros Añadidos: </h4>
      <ul>
        {this.state.Get_Data.map((item,index) => (
          <li key={index}>{Number(item.toString())}</li>
        ))}
      </ul>

&nbsp;

<h4> Cuantos numeros hay añadidos: {(this.state.Length).toString()} </h4>

&nbsp;

<h1> Añadir numero </h1>

<form onSubmit = {(event) => {
    event.preventDefault()
     const mensaje = 'Añadiendo numero...'
     const data = this.data.value
      this.add(data, mensaje)
      }}>  

<input type= 'text' 
   className='form-control mb-1' 
    placeholder = 'Añadir numero'
    ref = {(input) => {this.data = input}}/> 


<input type = 'submit'
   className= 'btn btn-block btn-warning btn-sm'
   value = 'Añadir'/> 

</form>
&nbsp;

<h4> El numero solicitado es: {(this.state.get_id).toString()} </h4>

&nbsp;

&nbsp;

<h1> Obtener un numero según su posición: </h1>

<form onSubmit = {(event) => {
    event.preventDefault()
     const mensaje = 'Obteniendo numero...'
     const id = this.id.value
      this.get(id, mensaje)
      }}>  

<input type= 'text' 
   className='form-control mb-1' 
    placeholder = 'Obtener numero'
    ref = {(input) => {this.id = input}}/> 


<input type = 'submit'
   className= 'btn btn-block btn-warning btn-sm'
   value = 'Obtener'/> 

</form>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
