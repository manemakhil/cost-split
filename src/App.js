/*
This contains the enitre data of the application some of which is stored in the state.

groups: this holds the various groups amongst whom people share expenses.
Format: 
  groups
    {
      group_name: [people]
    }

expenditure: this holds the profile of the people and the log of their individual expenses
Format:
  expenditure
    {
      name: {
        group: expense
      }
    }

people: holds the various people and how much they own
Format:
  people
    {
      name: {
        owe_name: amount (- for owe, + for gain)
      }
    }

* On Addition of people, they will be automatically assigned to the default group: Everyone. They can be included in additional groups 
  as requried. groups will hold the data of the people in each group. people will also hold the details, but in a format convinent for 
  calculations
* people will hold the expenses taht each owns
* On inclusion of an expense, the source funds will be split equally into the member of the group, and be assigned respectively in people.
* 
*/

import React, { Component, Fragment } from 'react';
import './App.css';

import View from './Components/View';
import Navigation from './Components/Navagation';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      groups: undefined,
      people: undefined,
      expenditure: undefined
    }

    this.addGroup = this.addGroup.bind(this);
    this.addExpense = this.addExpense.bind(this);
    this.initialize = this.initialize.bind(this);
  }

  //Method to add new groups and people involved. Validations to be done before call
  addGroup(groupName, ...people) {
    let tempState = { ...this.state };

    //Adding the new group and people in it to a temp state variable
    tempState.groups[groupName] = people;
    people.forEach((person) => {
      console.log(person);
      console.log(tempState.expenditure);
      tempState.expenditure[person][groupName] = 0;
    });

    //Setting the state
    this.setState({
      ...tempState
    });
  }

  //Method to record, split and assign the expense
  addExpense(group, sourcePerson, expense) {
    let tempState = { ...this.state };

    //Splitting the expense amongst the group
    let split = expense / tempState.groups[group].length

    tempState.groups[group].forEach((fellow) => {
      if (fellow !== sourcePerson) {
        //Checking if the Source already owes this Fellow
        let sourcePersonRecord = tempState.people[sourcePerson][fellow];
        if (sourcePersonRecord < 0) {
          //Splitting and equalizing the expenses depending who's is greater
          let diff = Math.abs(Math.abs(sourcePersonRecord) - Math.abs(split));
          
          tempState.people[sourcePerson][fellow] = 0;
          tempState.people[fellow][sourcePerson] = 0;
          //Adjusting for negative vaules
          sourcePersonRecord < split ?  tempState.people[sourcePerson][fellow] = -diff : tempState.people[fellow][sourcePerson] = -diff;
        } else {
          tempState.people[fellow][sourcePerson] -= split;
        }
      }
    });

    //Recording individual expense
    tempState.expenditure[sourcePerson][group] += expense;


    //Setting the state
    this.setState({
      ...tempState
    });
  }

  //Initial set up
  initialize(...people) {
    let tempState = { ...this.state };

    tempState.groups = {};
    tempState.groups["Everyone"] = people;

    tempState.expenditure = {};
    people.forEach((person) => {
      tempState.expenditure[person] = {};
      tempState.expenditure[person]["Everyone"] = 0;
    });

    tempState.people = {};
    people.forEach((main_person) => {
      tempState.people[main_person] = {};
      people.forEach((sub_person) => {
        if (main_person !== sub_person)
          tempState.people[main_person][sub_person] = 0;
      })
    })

    this.setState({
      ...tempState
    });
  }

  render() {
    return (
      <Fragment>

        <div className="viewBlur">
          <Navigation
            groups={this.state.groups}
            people={this.state.expenditure !== undefined ? Object.keys(this.state.expenditure) : []}
            addGroup={this.addGroup}
            addExpense={this.addExpense}
          />
          <View 
            data={this.state.people} 
            initialize = {this.initialize}
          />
        </div>
        <div id="root2">

        </div>
      </Fragment>
    );
  }
}

export default App;
