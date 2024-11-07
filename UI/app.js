// Replace this with your Besu node's RPC URL
const besuRpcUrl = 'http://localhost:8545'; // e.g., http://localhost:8545

// Initialize Web3 with MetaMask's provider
let web3;
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    // Request account access if needed
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
            console.log('Connected accounts:', accounts);
        })
        .catch(error => {
            console.error('User denied account access:', error);
            alert('Please allow access to your Ethereum accounts in MetaMask.');
        });
} else {
    console.error('MetaMask is not installed. Please install MetaMask.');
    alert('Please install MetaMask!');
}

// Contract ABI and address
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "eventId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "date",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "ticketPrice",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalTickets",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "organizer",
                "type": "address"
            }
        ],
        "name": "EventAdded",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "events",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "eventId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "date",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "ticketPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalTickets",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "ticketsSold",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "organizer",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_date",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_ticketPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_totalTickets",
                "type": "uint256"
            }
        ],
        "name": "addEvent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const contractAddress = '0x42699A7612A82f1d9C36148af9C77354759b210b'; // Replace with your actual contract address

// Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

console.log('Contract Address:', contractAddress);
console.log('Contract Instance:', contract);

async function addEvent() {
    try {
        // Fetch the list of accounts
        const accounts = await web3.eth.getAccounts();
        console.log('Accounts:', accounts);

        if (accounts.length === 0) {
            throw new Error('No accounts found. Make sure your wallet is connected.');
        }

        const account = accounts[0];

        const name = document.getElementById('name').value;
        const date = new Date(document.getElementById('date').value).getTime() / 1000;
        const ticketPrice = document.getElementById('ticketPrice').value;
        const totalTickets = document.getElementById('totalTickets').value;

        // Send transaction to add event
        const receipt = await contract.methods.addEvent(name, date, ticketPrice, totalTickets)
            .send({ from: account });

        console.log('Event added successfully:', receipt);
        alert('Event added successfully!');
    } catch (error) {
        console.error('Error adding event:', error);
        alert('Error adding event. See console for details.');
    }
}

async function viewEvent() {
    try {
        const eventId = document.getElementById('eventId').value;

        const event = await contract.methods.events(eventId).call();
        const eventDetailsDiv = document.getElementById('eventDetails');
        
        if (event) {
            eventDetailsDiv.innerHTML = `
                <p><strong>Name:</strong> ${event.name}</p>
                <p><strong>Date:</strong> ${new Date(event.date * 1000).toLocaleString()}</p>
                <p><strong>Ticket Price:</strong> ${event.ticketPrice} wei</p>
                <p><strong>Total Tickets:</strong> ${event.totalTickets}</p>
                <p><strong>Tickets Sold:</strong> ${event.ticketsSold}</p>
                <p><strong>Organizer:</strong> ${event.organizer}</p>
            `;
        } else {
            eventDetailsDiv.innerHTML = '<p>No event found with this ID.</p>';
        }
    } catch (error) {
        console.error('Error viewing event:', error);
        alert('Error viewing event. See console for details.');
    }
}

