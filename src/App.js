import React, { Component } from 'react';
import { format, addDays, setHours } from 'date-fns';
import { Container, Button, FormGroup, Form, Label, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import './App.css';

BigCalendar.momentLocalizer(moment);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participant: '',
      date: format(new Date(), 'YYYY-MM-DD'),
      showScheduledDates: false,
      scheduledDates: [],
      modal: false
    };

    this.handleParticipantChange = this.handleParticipantChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleParticipantChange(event) {
    this.setState({ participant: event.target.value });
  }

  handleDateChange(event) {
    this.setState({
      date: event.target.value
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { date, participant } = this.state;
    const scheduleDays = [0, 1, 2, 7, 14, 21, 28, 56, 84, 112, 140, 168];
    const scheduledDates = scheduleDays.map((d, i) => {
      const eventDate = addDays(date, d);
      return {
        id: i,
        title: `Follow up ${i+1} for ${participant}`,
        start: setHours(eventDate, 14),
        end: setHours(eventDate, 15)
      };
    });
    this.setState({ scheduledDates, showScheduledDates: true });
  }

  render() {
    return (
      <Container>
        <h2>Schedule new follow up appointments</h2>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="participant">Participant</Label>
            <Input
              type="text"
              name="participant"
              placeholder="Participant name or study number"
              value={this.state.participant}
              onChange={this.handleParticipantChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="start">Start date</Label>
            <Input
              type="date"
              name="start"
              placeholder="MM/DD/YYYY"
              value={this.state.date}
              onChange={this.handleDateChange}
              required
            />
          </FormGroup>
          <Button color="primary" type="submit" value="submit">Submit</Button>
        </Form>
        {
          this.state.showScheduledDates &&
          <div>
            <hr />
            <h4>Preview</h4>
            <BigCalendar
              events={this.state.scheduledDates}
              defaultDate={new Date()}
	      views={['month']}
            />
            <Button onClick={this.toggle} color="primary" >Publish to Google Calendar</Button>
          </div>
        }
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Success</ModalHeader>
          <ModalBody>
            Follow up appointments published to Google Calendar
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Close</Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default App;
