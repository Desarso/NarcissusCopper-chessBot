import React from 'react';
import ReactDOM from "react-dom";
import $ from 'jquery';
import  '../../node_modules/jquery-ui/dist/jquery-ui';

class DragMe extends React.Component {
    constructor() {
      super();
      this.dragRef = React.createRef();
     
    }
  
    componentDidMount() {
      this.$dragMe = $(this.dragRef.current);
      this.$dragMe.draggable({
        helper: "clone"
      }); 
    }
  
    componentDidUpdate(prevProps) {}
  
    componentWillUnmount() {}
  
    handleChange(e) {}
   
    render() {
      return (
        <section 
             ref={this.dragRef}
             className = {this.props.className}
             >
            {this.props.text}
        </section>
      );
    }
  }
  

function NewChessSquare() {
  return (
    <div>
         <DragMe
         className="piece white rook"
         text="alo"
         />
    </div>
       
  )
}

export default NewChessSquare