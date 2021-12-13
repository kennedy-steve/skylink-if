import React from "react";
import { InView } from "react-intersection-observer";
import './termynal.css';
import Termynal from './termynal';

export default class Terminal extends React.Component {

   terminal = null;
   startedAlready = false;

    componentDidMount() {
        this.terminal = new Termynal(this.t, {
            typeDelay: 40,
            lineDelay: 700
        });
    }

    restartTerminal(terminal, inView) {
       
       if (inView && terminal != null && !this.startedAlready) {
           terminal.start();
           this.startedAlready = true;
       }
       
       
    }

    render() {
        return (
           <InView as="div" onChange={
               (inView, entry, observer) => {
                   this.restartTerminal(this.terminal, inView)
               }
           }>
                <div data-terminal style={this.props.style} ref={t => this.t = t}>
                    {this.props.children}
                </div>
           </InView>
        );
    }
}