import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import './App.css';

function App() {

  // Utiliser la fonction connect pour connecter le wallet
  const { connect } = useConnect({ connector: new MetaMaskConnector() });
  const { address } = useAccount();
  const { disconnect } = useDisconnect()

  

  return (
    <>
      <div>
        <h1>MYT Faucet</h1>
        <h3>Créditer votre compte crypto de 2 MYT par jour (2 x 1 MYT espacé de 6 heures ) </h3>
      </div>
      <div className="card">
        <h3>Connectez vous à votre Wallet</h3>
        {!address ? 
          <button onClick={() => connect()}>Connexion MetaMask</button> 
          : 
          <>
            <button onClick={() => disconnect()}>Déconnexion MetaMask</button>
            <p>connect as: {address}</p>
          </>
          
        }
      </div>
      <div>
        <input type="text"  placeholder="Entrez votre adresse de votre compte crypto" />
        <button>Valider</button>
      </div>
    </>
  );
}

export default App;
