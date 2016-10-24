// src/ReactCalculator.js

import React, { Component } from 'react';
import {
    Text,
    View,
    AppRegistry
} from 'react-native';
import Style from './Style'
import InputButton from './InputButton';

// Define the input buttons that will be displayed in the calculator.
const inputButtons = [
    ['CE','C', 'Del', ''],
    ['1', '2', '3', '/'],
    ['4', '5','6', '*'],
    ['7', '8', '9', '-'],
    ['0', '.', '=', '+']
];


class ReactCalculator extends Component {

    constructor( props ){
        super(props);

        this.state = {
            inputValue : 0,
            totalFormula : null,
            calculationComplete : false
        }

    }


    render() {
        return (
            <View style={Style.rootContainer}>
                <View style={Style.displayFormula}>
                  <Text style={Style.displayFormulaText}>{this.state.totalFormula}</Text>
                </View>
                <View style={Style.displayContainer}>
                  <Text style={Style.displayText}>{this.state.inputValue}</Text>
                </View>
                <View style={Style.inputContainer}>
                  {this._renderInputButtons()}
                </View>
            </View>
        )
    }

    /**
      * For each row in `inputButtons`, create a row View and add create an InputButton for each input in the row.
      */
     _renderInputButtons() {
         let views = [];

         for (var r = 0; r < inputButtons.length; r ++) {
             let row = inputButtons[r];

             let inputRow = [];
             for (var i = 0; i < row.length; i ++) {
                 let input = row[i];

                 inputRow.push(
                     <InputButton
                        value={input}
                        key={r + "-" + i}
                        highlight={this.state.selectedSymbol === input}
                        onPress={this._onInputButtonPressed.bind(this, input)} />
                 );
             }

             views.push(<View style={Style.inputRow} key={"row-" + r}>{inputRow}</View>)
         }

         return views;
     }


      _onInputButtonPressed(input) {
          switch (typeof input) {
            case 'number':
              return this._handleNumberInput( input);
              break;
            case 'string':
              return this._handleStringInput( input );
              break;

          }
      }

     _handleNumberInput(num) {
         let inputValue = (this.state.inputValue * 10) + num;

         this.setState({
             inputValue: inputValue
         })
     }

     _handleStringInput(str){
       let inputValue = this.state.inputValue,
            currentformula = this.state.totalFormula,
            calculationCompleted = this.state.calculationCompleted;

       switch (str) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
              if( inputValue == '0' || calculationCompleted ){
               inputValue = '';
              }

              if( calculationCompleted){
               currentformula = '';
               calculationCompleted = false;
             }
              inputValue += str;

              this.setState({
                inputValue : inputValue,
                totalFormula : currentformula,
                calculationCompleted : false
              })
              break;

            case '/':
            case '*':
            case '+':
            case '-':
              currentformula = this._appendFormula( currentformula, str, inputValue );
              this.setState({
                    totalFormula : currentformula,
                    inputValue: 0
                });
              break;

            case '=':
               currentformula = this._appendFormula( currentformula, str, inputValue );

              this.setState({
                  inputValue: eval( currentformula.substring( 0, currentformula.length -1 ) ),
                  totalFormula : currentformula,
                  calculationCompleted : true
              });

              break;

            case 'Del':
              if( ! calculationCompleted ){
                if( inputValue.length > 0 ){
                  inputValue = inputValue.substring( 0, inputValue.length -1 );

                  if( inputValue.length == 0){
                    inputValue = '0';
                  }
                  this.setState({
                    inputValue : inputValue
                  })
                }
              }
              break;

            case 'CE' :
              if( ! calculationCompleted ){
                inputValue = '0';

                this.setState({
                  inputValue : inputValue
                })
              }
              break;

            case 'C' :
              currentformula = '';
              inputValue = '0';

              this.setState({
                inputValue : inputValue,
                totalFormula : currentformula
              })

              break;
        }
     }

     _appendFormula( currentformula,  str, inputValue ){
       if( currentformula != null ){
         currentformula +=  inputValue + str;
       }
       else {
         currentformula = inputValue + str;
       }
       return currentformula;
     }

}

AppRegistry.registerComponent('ReactCalculator', () => ReactCalculator);
