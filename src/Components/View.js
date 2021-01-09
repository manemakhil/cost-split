import React, { Component, Fragment } from 'react';
import './View.scss'
class View extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let display;
        if (this.props.data !== undefined)
            display = Object.keys(this.props.data).map((person, i) =>
                <div className={(() => "carousel-item" + (i === 0 ? " active" : ""))()}>
                    <div className="title">{person}</div>
                    <table>
                        {
                            Object.keys(this.props.data[person]).map((sub_person) =>
                                <tr>
                                    <td>{sub_person}</td>
                                    <td>{this.props.data[person][sub_person]}</td>
                                </tr>
                            )
                        }
                    </table>
                </div>
            )
        else
            display = "Please Enter something"

        return (
            <div className="container">
                <div className="row">
                    <div id="slider" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                            {display}
                        </div>
                        <a class="carousel-control-prev" href="#slider" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon"></span>
                            
                        </a>
                        <a class="carousel-control-next" href="#slider" role="button" data-slide="next">
                            <span class="carousel-control-next-icon"></span>
                            
                        </a>
                    </div>
                </div>
            </div>
        )


    }
}

export default View;