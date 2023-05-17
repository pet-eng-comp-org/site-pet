
import Participant from '../Participant/Participant'
import "./Egress.css"
import Nav from "../../Navbar/Nav";

import React, { Component, Fragment } from "react";
import { MDBContainer, MDBIcon, MDBFormInline, MDBNav, MDBNavItem, MDBNavLink, MDBRow, MDBCol, MDBInput, MDBBtnGroup, MDBBtn } from "mdbreact";

  class Egress extends Component {
    state = {
      activeItem: 0
    };

    renderEgresses(){
        let egr = [];
        for(let i = 0; i < 20; i++){
            egr.push(
                <MDBCol md={4}>

                <Participant
                
                className='egress-card'
                name='João Lucas'
                dateIn='2018-08-02'
                dateOut='2020-08-02'
                imgSrc={require('../../../assets/JoaoLucas/Normal.png')}
                hoverAction={false}
                imgSize={1}
                tutor={i % 5 == 0 ? true : false}
                
                
                />
                </MDBCol>
            )
        }
        return egr;
    }

    handle(i){
        if(this.state.activeItem == i) i = -1;
        this.setState({activeItem:i});
        this.forceUpdate();
    }

    render() {
      return (
        <div>
            <Nav/>
            <div className='egress'>
                <div className='text-content'>
                    <h1>Petianos Egressos</h1>
                    <p>
                        O PET Eng Comp tem mais de 20 anos de existência e muitos petianos egressos. Confira aqui os membros que fizeram:
                    </p>
                </div>
                <MDBContainer>
                    <MDBRow>
                    <MDBCol md="12" className='d-flex justify-content-center'>
                        <MDBFormInline className="md-form">
                            <MDBIcon icon="search" />
                            <MDBCol size='auto'>
                                <input className="form-control ml-3 mr-5 w-100" type="text" placeholder="Search" aria-label="Search"/>
                            </MDBCol>
                            <MDBCol size='auto'>
                                <MDBBtn active={this.state.activeItem == 0 ? true:false} onClick={()=>{this.handle(0)}} className='pt-2 pb-2 pl-3 pr-3'> Nome <MDBIcon icon='sort' className='pl-1'/></MDBBtn>
                                <MDBBtn active={this.state.activeItem == 1 ? true:false} onClick={()=>{this.handle(1)}} className='pt-2 pb-2 pl-3 pr-3'> Entrada <MDBIcon icon='sort' className='pl-1'/></MDBBtn>
                                <MDBBtn active={this.state.activeItem == 2 ? true:false} onClick={()=>{this.handle(2)}} className='pt-2 pb-2 pl-3 pr-3'> Saída <MDBIcon icon='sort' className='pl-1'/></MDBBtn>
                                <MDBBtn active={this.state.activeItem == 3 ? true:false} onClick={()=>{this.handle(3)}} className='pt-2 pb-2 pl-3 pr-3'> Tutor <MDBIcon icon='sort' className='pl-1'/></MDBBtn>
                            </MDBCol>
                        </MDBFormInline>
                    </MDBCol>

                    </MDBRow>
                    
                    <MDBRow>
                        {this.renderEgresses()}
                    </MDBRow>
                </MDBContainer>
            </div>
        
        
      </div>
    );
  }
}

export default Egress;