import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;

    const graphqlQuery = {
      query: `{
        getPost(postId:"${postId}") {
          title
          createdAt
          creator{name}
          imageUrl
          content
        }
      }`
    };

    // fetch(`http://localhost:8080/feed/post/${postId}`, {
    //   headers: {
    //     Authorization: `Bearer ${this.props.token}`
    //   }
    // })
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.token}`
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.errors) {
          throw new Error('Failed to fetch post');
        }
        this.setState({
          title: resData.data.getPost.title,
          author: resData.data.getPost.creator.name,
          image: `http://localhost:8080/${resData.data.getPost.imageUrl}`,
          date: new Date(resData.data.getPost.createdAt).toLocaleDateString(
            'en-US'
          ),
          content: resData.data.getPost.content
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>{' '}
        <h2>
          Created by {this.state.author} on {this.state.date}{' '}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>{' '}
      </section>
    );
  }
}

export default SinglePost;
