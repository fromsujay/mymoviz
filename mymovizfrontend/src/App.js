import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './App.css';


class App extends Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleClickLikeOn=this.handleClickLikeOn.bind(this);
    this.handleClickLikeOff=this.handleClickLikeOff.bind(this);
    this.handleClick=this.handleClick.bind(this);

    this.state = {
      popoverOpen: false,
      viewOnlyLike: false,
      moviesCount: 0,
      moviesNameList: [],
      movies: [],
      moviesLiked: []
      };
    }

    componentDidMount(){

      var ctx = this;
      var moviesNameListCopy = [...this.state.moviesNameList];
      var length = 0;

      fetch('http://localhost:3001/movies')
      .then(function(response) {
      return response.json();
      })
      .then(function(data) {
        ctx.setState({movies: data});
      })
      .catch(function(error) {
      });

      fetch('http://localhost:3001/mymovies').then(function(response) {
      return response.json();
      }).then(function(data) {
        ctx.setState({moviesLiked: data});
        ctx.setState({moviesCount: data.length});
        length = data.length;

        if(length === 0) {
          moviesNameListCopy.push('aucun films selectionnés');
        } else if (length === 1) {
          moviesNameListCopy.push(data[0].title);
        } else if (length === 2) {
          moviesNameListCopy.push(data[0].title);
          moviesNameListCopy.push(data[1].title);
        } else {
          moviesNameListCopy.push(data[length-1].title);
          moviesNameListCopy.push(data[length-2].title);
          moviesNameListCopy.push(data[length-3].title);
        }
        ctx.setState({moviesNameList: moviesNameListCopy});
      }).catch(function(error) {
      });

      };

  toggle() {
  this.setState({
    popoverOpen: !this.state.popoverOpen
    });
  }

  handleClickLikeOn() {
    this.setState({
      viewOnlyLike: true
    })
  }
  handleClickLikeOff() {
    this.setState({
      viewOnlyLike: false
    })
  }

  handleClick(isLike, name) {
    var moviesNameListCopy = [...this.state.moviesNameList]
    if (isLike) {
      moviesNameListCopy.push(name);
      this.setState({
        moviesCount: this.state.moviesCount+1,
        moviesNameList : moviesNameListCopy
      })
    } else {
      var index = moviesNameListCopy.indexOf(name);
      moviesNameListCopy.splice(index,1);
      this.setState({
        moviesCount: this.state.moviesCount-1,
        moviesNameList : moviesNameListCopy
      })
    }
  }

  render() {

    var moviesLiked = [];

    if (this.state.movies !== undefined) {
      for (var i = 0; i < this.state.movies.length; i++) {
        var isLike = false;
        for (var k = 0; k < this.state.moviesLiked.length; k++) {
          if (this.state.movies[i].id === this.state.moviesLiked[k].idMovieDB) {
            isLike = true;
            break;
          }
        }
        moviesLiked.push(<Movie key={i} viewOnly={this.state.viewOnlyLike} movieLiked={isLike} movieImg={this.state.movies[i].poster_path} movieName={this.state.movies[i].title} movieDesc={this.state.movies[i].overview} handleClickParent={this.handleClick} idMovie={this.state.movies[i].id}/>);
      }
    }

    var moviesLast = '';

    if(this.state.moviesNameList[0] === 'aucun films selectionnés' && this.state.moviesNameList.length === 1) {
      moviesLast = 'aucun films selectionnés';
    } else if (this.state.moviesNameList[0] === 'aucun films selectionnés' && this.state.moviesNameList.length === 2) {
      moviesLast = this.state.moviesNameList[1];
    } else if (this.state.moviesNameList[0] === 'aucun films selectionnés' && this.state.moviesNameList.length === 3) {
      moviesLast = this.state.moviesNameList[1]+','+this.state.moviesNameList[2];
    } else if (this.state.moviesNameList[0] === 'aucun films selectionnés' && this.state.moviesNameList.length === 4) {
      moviesLast = this.state.moviesNameList[1]+','+this.state.moviesNameList[2]+','+this.state.moviesNameList[3];
    } else if (this.state.moviesNameList[0] === 'aucun films selectionnés' && this.state.moviesNameList.length > 4) {
      moviesLast = this.state.moviesNameList[this.state.moviesNameList.length-1]+', '+this.state.moviesNameList[this.state.moviesNameList.length-2]+', '+this.state.moviesNameList[this.state.moviesNameList.length-3]+'...';
    } else if (this.state.moviesNameList[0] !== 'aucun films selectionnés' && this.state.moviesNameList.length === 1) {
      moviesLast = this.state.moviesNameList[0];
    } else if (this.state.moviesNameList[0] !== 'aucun films selectionnés' && this.state.moviesNameList.length === 2) {
      moviesLast = this.state.moviesNameList[0]+','+this.state.moviesNameList[1];
    } else if (this.state.moviesNameList[0] !== 'aucun films selectionnés' && this.state.moviesNameList.length === 3) {
      moviesLast = this.state.moviesNameList[0]+','+this.state.moviesNameList[1]+','+this.state.moviesNameList[2];
    } else if (this.state.moviesNameList[0] !== 'aucun films selectionnés' && this.state.moviesNameList.length > 3) {
      moviesLast = this.state.moviesNameList[this.state.moviesNameList.length-1]+', '+this.state.moviesNameList[this.state.moviesNameList.length-2]+', '+this.state.moviesNameList[this.state.moviesNameList.length-3]+'...';
    }


    return (

      <Container>
        <Row>
            <Nav className="header">
              <NavItem>
                <NavLink href="#"><img src="../logo.png"/></NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="navTextColour" onClick={this.handleClickLikeOff} href="#">Last Releases</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="navTextColour" onClick={this.handleClickLikeOn} href="#">My Movies</NavLink>
              </NavItem>
              <Button id="Popover1" onClick={this.toggle}>
                {this.state.moviesCount} Movies
              </Button>
              <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
                <PopoverHeader>Derniers films ajoutés</PopoverHeader>
                <PopoverBody>{moviesLast}</PopoverBody>
                </Popover>
            </Nav>
        </Row>

        <Row>
          {moviesLiked}
        </Row>


      </Container>
    );
    }
  }

    class Movie extends Component {

      constructor(props) {
        super(props);
        this.handleClick=this.handleClick.bind(this);
        this.state = {
          like: this.props.movieLiked,
        };
      }

      handleClick() {
        var likeState = !this.state.like
        this.setState({
          like: likeState
          });
        if(likeState) {
          fetch('http://localhost:3001/mymovies', {
          method: 'POST',
          headers: {'Content-Type':'application/x-www-form-urlencoded'},
          body: 'poster_path='+this.props.movieImg+'&overview='+this.props.movieDesc+'&title='+this.props.movieName+'&idMovieDB='+this.props.idMovie
          }).then(function(response) {
          return response.json();
        }).then(function(data) {
        }).catch(function(error) {
        });
      } else {
        fetch('http://localhost:3001/mymovies/'+this.props.idMovie, {method: 'DELETE'});
      }
      this.props.handleClickParent(likeState, this.props.movieName);
      }



      render(){

        var heartColour = 'unlove';
        if(this.state.like===true) {
          heartColour = 'love';
        } else {
          heartColour = 'unlove';
        }

        var visibilityStatus = {marginBottom: '15px'};
        if(this.props.viewOnly===false) {
          visibilityStatus = {marginBottom: '15px'};
        } else if(this.state.like===true && this.props.viewOnly===true){
          visibilityStatus = {marginBottom: '15px'};
        } else if (this.state.like===false && this.props.viewOnly===true) {
          visibilityStatus = {marginBottom: '15px', display: 'none'};
        }

        return (
          <Col xs="12" md="6" lg="3" style={visibilityStatus}>
            <Card>
              <FontAwesomeIcon className={heartColour} icon={faHeart} style={{position: 'absolute', top:'5%', left: "90%"}} onClick={this.handleClick}/>
              <CardImg top width="100%" src={'https://image.tmdb.org/t/p/w500'+this.props.movieImg} alt="Card image cap"/>
              <CardBody>
                <CardTitle>{this.props.movieName}</CardTitle>
                <CardText>{this.props.movieDesc}</CardText>
              </CardBody>
            </Card>
          </Col>
        );
      }
    };

export default App;
