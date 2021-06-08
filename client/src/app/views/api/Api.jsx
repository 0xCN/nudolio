import React, { Component, Fragment } from "react";
import AppMarkdown from './docs.md';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { duotoneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'


const components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <SyntaxHighlighter style={duotoneDark} language={match[1]} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
    ) : (
      <code className={className} {...props} />
    )
  }
}

class Api extends Component {
  state = {
    markdown: ''
  }

  componentDidMount() {
    fetch(AppMarkdown).then(res => res.text())
    .then(text => this.setState({ markdown: text }));
  }

  render() {
    const { markdown } = this.state;
    return (
      <Fragment>
        <div className="divPadding">
          <ReactMarkdown components={components} children={markdown} />
        </div>
      </Fragment>
    );
  }
}


export default Api;