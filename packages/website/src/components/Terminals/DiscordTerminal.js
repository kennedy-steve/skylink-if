import React from "react";
import { InView } from "react-intersection-observer";
import './discord-termynal.css';
import Termynal from './termynal';

export default class Terminal extends React.Component {

   discordTerminal = null;
   startedAlready = false;

    componentDidMount() {
        this.discordTerminal = new Termynal(this.t, {
            typeDelay: 40,
            lineDelay: 2000,
            cursor: '|',
            prefix: 'disco',
            terminalName: 'discord',
        });
    }

    restartDiscordTerminal(discordTerminal, inView) {
       
       if (inView && discordTerminal !== null && !this.startedAlready) {
           discordTerminal.start();
           this.startedAlready = true;
       }
       
       
    }

    render() {
        return (
           <InView as="div" onChange={
               (inView, entry, observer) => {
                   this.restartDiscordTerminal(this.discordTerminal, inView)
               }
           }>
                <div data-discord style={this.props.style} ref={t => this.t = t}>
                    {this.props.children}
                </div>
           </InView>
        );
    }
}