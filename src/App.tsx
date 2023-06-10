import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { ToastContainer, toast } from 'react-toastify';
import { useProvider, useContractWrite } from 'ethers-react';
import { ethers } from 'ethers';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { useFaucetMint, useFaucetWithdraw, useFaucetOwner, useFaucetTransfer  } from './wagmi.generated';

function App() {

  // Utiliser la fonction connect pour connecter le wallet
  const { connect } = useConnect({ connector: new MetaMaskConnector() });
  const { address } = useAccount();
  const { disconnect } = useDisconnect()

  const { write: mint } = useFaucetMint();
  const faucetWithdraw = useFaucetWithdraw();
  const faucetABI = [
    // Copiez ici l'ABI du contrat Faucet
  ];

  const handleMint = async () => {
    try {
      const provider = useProvider();
  
      if (address) {
        const userBalance = await provider.getBalance(address);
        const requiredAmount = ethers.utils.parseEther('0.5');
  
        if (userBalance.gte(requiredAmount)) {
          await mint(/* args */);
          toast.success('Mint successful!', { autoClose: 4000 });
  
          // Transférer 4,99 ether sur le compte utilisateur
          const transferAmount = ethers.utils.parseEther('4.99');
          const transferConfig = {
            value: transferAmount,
            to: address,
          };
  
          const useFaucetTransfer = useContractWrite({
            abi: faucetABI,
            functionName: 'transfer',
            // Autres configurations nécessaires pour le transfert
          });
  
          const transferResult = await useFaucetTransfer.transfer(transferConfig);
          if (transferResult && transferResult.status === 'success') {
            toast.success('Transfert réussi !');
          } else {
            toast.error('Erreur lors du transfert.');
          }
        } else {
          toast.error(
            "Fonds insuffisants. Vous devez payer 0.5 ether pour effectuer le minting."
          );
        }
      } else {
        toast.error("Vous devez d'abord vous connecter à votre wallet.");
      }
    } catch (error) {
      toast.error('Mint error!');
    }
  };

  const handleWithdraw = async () => {
    try {
      if (address) {
        const { data: ownerData } = useFaucetOwner();
        const isOwner = ownerData === address;
  
        if (isOwner) {
          await faucetWithdraw.write(/* args */);
          toast.success('Retrait réussi !', { autoClose: 4000 });
        } else {
          toast.error("Seul le propriétaire du contrat peut effectuer un retrait.");
        }
      } else {
        toast.error('Vous devez d\'abord vous connecter à votre wallet.');
      }
    } catch (error) {
      toast.error('Erreur de retrait !');
    }
  };

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
            <p><h3>Le compte connecté est: </h3>{address}</p>
          </>
        }
      </div>
      <div className="card">
      {!address ? 
          <input type="text" placeholder="Entrez votre adresse de votre compte crypto" /> 
          : 
          <input type="text" placeholder={address} />
        }
        <p>Lors de l'achat d'un MYT, une preuve de bonne foi sous forme de 0,5 ether vous sera demandée, mais une fois que le MYT sera crédité, vous recevrez un remboursement de 0,499 ether en signe de confiance.</p>
        <button onClick={handleMint} >Acheter 1 MYT</button>
      </div>
      <div className="card">
      <p>Seul le propriétaire du contrat peu récolter les fonds.</p>
        <button onClick={handleWithdraw} >Retrait</button>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
