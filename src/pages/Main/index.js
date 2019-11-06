import React, { Component } from 'react';
import {FaGithubAlt, FaPlus, FaSpinner} from 'react-icons/fa';
import {Link} from 'react-router-dom';


import api from '../../services/api';
import Container from '../../components/Container';
import { Form, SubmitButton, List} from './styles';

export default class Main extends Component {

  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: false,
  }

  componentDidMount(){
    const repositories = localStorage.getItem('repositories');

    if(repositories){
      this.setState({ repositories: JSON.parse(repositories)});
    }
  }

  componentDidUpdate(_, prevState){
    const {repositories} = this.state;

    if(prevState.repositories !== repositories){
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value })
  }

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });

    try{

      const { newRepo, repositories } = this.state;

      if (newRepo === '')
        throw 'Você precisa indicar um repositório';

      const hasRepo = repositories.find(r => r.name === newRepo);

      if (hasRepo)
        throw 'Repositório duplicado';

      const response = await api.get(`/repos/${newRepo}`);

      const data = { name: response.data.full_name };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
      })
    }catch(err){
      this.setState({ error: true });
    }

    this.setState({ loading:false });

  }

  render (){
    const { newRepo, loading, repositories, error } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>
        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type='text'
            placeholder="Adicionar Repositório"
            value={newRepo}
            onChange={ this.handleInputChange}
          />

          <SubmitButton loading={ loading }>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(respository=>(
            <li key={respository.name}>
              <span>{respository.name}</span>
              <Link to={`/repository/${encodeURIComponent( respository.name )}`}>Detalhes </Link>

            </li>
          ))}
        </List>

      </Container>
    );
  }
}
