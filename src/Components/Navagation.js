import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import './Navigation.scss';
import './global.scss';
/* Recieves props:

* Groups: group details 
* People: Array of all People

*/
class Navigation extends Component {
    constructor(props) {
        super(props);

        this.toggleModal = this.toggleModal.bind(this);

        this.addGroup = this.addGroup.bind(this);
        this.addExpense = this.addExpense.bind(this);

        this.state = {
            addGroup: false,
            addExpense: false,
            groupSelection: "Everyone"
        }
    }

    //Add group Modal
    addGroup() {
        //Validating and submitting the Add Group form
        let addGroupSubmit = (event) => {
            event.preventDefault();
            let groupName = event.target.groupName.value,
                selections = [],
                checkboxes = document.forms.addGroup.groupMembers;
            for (let option in checkboxes) {
                if (checkboxes[option].checked) {
                    selections.push(checkboxes[option].value)
                }
            }
            this.setState({
                ...this.state,
                addGroup: !this.state.addGroup,
                addExpense: !this.state.addExpense,
                groupSelection: groupName
            });
            this.props.addGroup(groupName, ...selections);
            
        }
        return (
            ReactDOM.createPortal(
                <div className="shadowOverlay addGroup">
                    <div className="content">
                        <form id="addGroup" onSubmit={addGroupSubmit}>
                            <label className="distinct">
                                <span>  Group Name </span>
                                <input id="groupName" name="groupName" type="text" />
                            </label>
                            <label className="distinct">
                                <p>Select Memebers: </p>
                                {
                                    this.props.people.map((person) =>
                                        <label>
                                            <input type="checkbox" name="groupMembers" value={person} />
                                            <span>{person}</span>

                                        </label>
                                    )
                                }

                            </label>

                            <button type="submit" form="addGroup">
                                Submit
                            </button>
                            <button onClick={() => { this.toggleModal("addGroup") }}>
                                Close
                            </button>

                        </form>

                    </div>

                </div>,
                document.getElementsByTagName('body')[0]
            )
        );
    }

    //Add Expense modal
    addExpense() {
        let addExpenseSubmit = (event) => {
            event.preventDefault();
            let formPointer = event.target;
            this.props.addExpense(formPointer.groups.value, formPointer.groupPeople.value, Number(formPointer.expense.value));
            this.setState({
                ...this.state,
                addExpense: !this.state.addExpense,
                groupSelection: "Everyone"
            })
        };

        let selectionChange = (event) => {
            this.setState({
                ...this.setState,
                groupSelection: event.target.value
            })
        }

        return (
            ReactDOM.createPortal(
                <div className="shadowOverlay addGroup">
                    <div className="content">
                        <form id="addExpense" onSubmit={addExpenseSubmit}>
                            <label className="distinct">
                                <span>Select the group:</span>
                                <select name="groups" onChange={selectionChange}>
                                    {
                                        Object.keys(this.props.groups).map((g) =>
                                            <option
                                                value={g}
                                                selected={ g === this.state.groupSelection}
                                            >
                                                {g}
                                            </option>
                                        )
                                    }
                                </select>
                            </label>

                            <label className="distinct">
                                <span> Select the source: </span>
                                {

                                    this.props.groups[this.state.groupSelection].map((p) =>
                                        <label>

                                            <input type="radio" name="groupPeople" value={p} />
                                            <span> {p}</span>
                                        </label>
                                    )

                                }

                            </label>
                            <label className="distinct">
                                Expense:
                                <input type="text" name="expense" />
                            </label>

                            <button type="submit">
                                Submit
                            </button>
                            <button onClick={() => { this.toggleModal("addExpense") }}>
                                Close
                            </button>

                        </form>

                    </div>

                </div>,
                document.getElementsByTagName('body')[0]
            )
        );
    }

    //Toggle the various Modals that are set up here
    toggleModal(modal) {
        this.setState({
            ...this.state,
            [modal]: !this.state[modal]
        });
    }

    render() {
        let display;

        if (this.props.groups !== undefined) {
            display =
                <Fragment>
                    <button onClick={() => this.toggleModal("addGroup")}>
                        Add Group
                    </button>
                    <button onClick={() => { this.toggleModal("addExpense") }}>
                        Add Expense
                    </button>
                </Fragment>
        } else {

        }

        //Blurring the entire background if either modal are set to visible
        this.state.addExpense === true || this.state.addGroup === true ? document.getElementById('root').style.filter = "blur(2px)" : document.getElementById('root').style.filter = "none";

        return (
            <Fragment>
                {this.state.addGroup ? this.addGroup() : <Fragment></Fragment>}
                {this.state.addExpense ? this.addExpense() : <Fragment></Fragment>}
                <nav className="nav">
                    <div className="brand">
                        {"Cost / Split"}
                    </div>

                    {display}


                </nav>
            </Fragment>
        );
    }
}

export default Navigation;