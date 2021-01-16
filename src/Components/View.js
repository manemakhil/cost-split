import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import './View.scss';

class View extends Component {
    constructor(props) {
        super(props);

        this.slide = this.slide.bind(this);

        this.state = {
            showInitiate: false,
            noOfPeople: 3
        }
    }

    initiateModal() {
        let changeInput = (event) => {
            event.preventDefault();
            let newVal = this.state.noOfPeople;

            newVal += event.target.name === "add" ? +1 : -1
            this.setState({
                ...this.state,
                noOfPeople: newVal
            });

        }

        let handleSubmit = (event) => {
            event.preventDefault();
            if (event.target.name === "close") {
                this.setState({
                    ...this.state,
                    showInitiate: !this.state.showInitiate
                })
            } else {
                let inputNames = event.target.names;
                this.props.initialize(
                    ...Object.keys(inputNames).map((n) =>
                        inputNames[n].value
                    )
                );
                this.setState({
                    ...this.setState,
                    noOfPeople: 3,
                    showInitiate: false
                })
            }
        }
        return (
            ReactDOM.createPortal(
                <div className="shadowOverlay">
                    <div className="content">
                        <form name="initiate" onSubmit={handleSubmit}>
                            {
                                ((n) => {
                                    let fieldSet = [];
                                    for (let i = 0; i < n; i++) {
                                        fieldSet.push(
                                            <label className="distinct">
                                                Member Name:
                                                <input type="text" name={"names"} id={"name" + i} />
                                            </label>

                                        );
                                    }
                                    return fieldSet
                                })(this.state.noOfPeople)
                            }
                            <div class="addSub">
                                <button name="add" className="addSub" nClick={changeInput}>
                                    +
                                </button>
                                <button name="sub" className="addSub" onClick={changeInput}>
                                    -
                                </button>
                            </div>
                            <button name="close" onClick={handleSubmit}>
                                Close
                            </button>
                            <button type="submit">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>,
                document.getElementsByTagName('body')[0]
            )
        )
    }
    slide(t) {
        let n = document.querySelectorAll('.expense.active')[0].id.split('-')[1],
            count = Object.keys(this.props.data).length;

        document.getElementById('item-' + n).classList.remove('active');
        if (t) {
            document.getElementById('item-' + (++n % (count - 1))).classList.add('active');
        } else {
            --n < 0 ? document.getElementById('item-' + (count - 1)).classList.add('active') : document.getElementById('item-' + n).classList.add('active');
        }

    }

    render() {
        let display;
        if (this.props.data !== undefined) {
            display =
                <Fragment>
                    <button className="viewController" onClick={() => this.slide(false)}>
                        {"<"}
                    </button>

                    {
                        Object.keys(this.props.data).map((person, i) =>

                            <div
                                className={(() => "expense" + (i === 0 ? " active" : ""))()}
                                id={(() => "item-" + i)()}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th colspan="2">
                                                {person} has to pay:
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Object.keys(this.props.data[person]).map((sub_person) =>
                                                <tr>
                                                    <td>{sub_person}: </td>
                                                    <td>{this.props.data[person][sub_person]}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>



                        )
                    }

                    <button className="viewController" onClick={() => this.slide(true)}>
                        {">"}
                    </button>

                </Fragment>

        }
        else
            display =
                <div className="initial">
                    <div>Split the costs amongst your friends, colleagues or Family. Will work with sub-group expenditure!</div>
                    <button
                        onClick={
                            () => {
                                this.setState({
                                    ...this.state,
                                    showInitiate: !this.state.showInitiate
                                })
                            }
                        }
                    >
                        Start!
                    </button>
                </div >

        //Blurring the entire background if either modal are set to visible
        this.state.showInitiate === true ? document.getElementById('root').style.filter = "blur(2px)" : document.getElementById('root').style.filter = "none";

        return (
            <div className="view" >
                {display}
                {this.state.showInitiate ? this.initiateModal() : <Fragment></Fragment>}
            </div>
        )


    }
}

export default View;