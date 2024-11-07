// Import Web3
import Web3 from 'web3';

let web3;
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // Request user permission
} else {
    alert("Please install MetaMask or another Ethereum-compatible browser extension.");
}

// Smart contract ABI and address
const contractABI = [
    // ABI of the Event contract (add the relevant parts for addEvent and viewEvent)
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
const contractAddress = "0x42699A7612A82f1d9C36148af9C77354759b210b";
// Initialize contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to add event
async function addEvent() {
    const name = document.getElementById('name').value;
    const date = Math.floor(new Date(document.getElementById('date').value).getTime() / 1000); // Convert date to Unix timestamp
    const ticketPrice = document.getElementById('ticketPrice').value;
    const totalTickets = document.getElementById('totalTickets').value;

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    try {
        // Call the smart contract function
        await contract.methods.addEvent(name, date, ticketPrice, totalTickets).send({ from: account });
        alert('Event added successfully!');
    } catch (error) {
        console.error("Error adding event:", error);
        alert("There was an error adding the event.");
    }
}

// Function to view event details
async function viewEvent() {
    const eventId = document.getElementById('eventId').value;

    try {
        const event = await contract.methods.viewEvent(eventId).call();
        const eventDetails = `
            <h3>Event Details</h3>
            <p>Name: ${event.name}</p>
            <p>Date: ${new Date(event.date * 1000).toLocaleDateString()}</p>
            <p>Ticket Price: ${event.ticketPrice} wei</p>
            <p>Total Tickets: ${event.totalTickets}</p>
            <p>Tickets Sold: ${event.ticketsSold}</p>
        `;
        document.getElementById('eventDetails').innerHTML = eventDetails;
    } catch (error) {
        console.error("Error viewing event:", error);
        alert("There was an error retrieving the event details.");
    }
}
