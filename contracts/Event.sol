// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Event {
    struct Event {
        uint eventId;
        string name;
        uint date;
        uint ticketPrice;
        uint totalTickets;
        uint ticketsSold;
        address payable organizer;
    }
    
    mapping(uint => Event) public events;
    uint nextEventId = 0; // initialize the event counter to 0

    event EventAdded(uint eventId, string name, uint date, uint ticketPrice, uint totalTickets, address organizer);

    function addEvent(string memory _name, uint _date, uint _ticketPrice, uint _totalTickets) public {
        require(_date > block.timestamp, "Event date must be in the future");
        require(_ticketPrice > 0, "Ticket price must be greater than zero");
        require(_totalTickets > 0, "Total tickets must be greater than zero");
        
        uint newEventId = generateEventId();
        
        Event memory newEvent = Event({
            eventId: newEventId,
            name: _name,
            date: _date,
            ticketPrice: _ticketPrice,
            totalTickets: _totalTickets,
            ticketsSold: 0,
            organizer: payable(msg.sender)
        });
        
        events[newEventId] = newEvent;
        emit EventAdded(newEventId, _name, _date, _ticketPrice, _totalTickets, msg.sender);
    }
    
    function generateEventId() internal returns (uint) {
        return nextEventId++;
    }
}
