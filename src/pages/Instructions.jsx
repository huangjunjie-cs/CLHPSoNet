import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
// import { InlineMath, BlockMath } from 'react-katex';
import './css/md.css';
import 'katex/dist/katex.min.css';

const intro_md = `

## Input

input the people you want to analysis


`


class Instructions extends Component {

    render() {
        return <div className="markdown-body"> 
            <ReactMarkdown source={intro_md} escapeHtml={false}/>
        </div>

    }
}

export default Instructions;
// export const MarkdownRender = () => {
//     const newProps = {
//       ...props,
//       plugins: [
//         RemarkMathPlugin,
//       ],
//       renderers: {
//         ...props.renderers,
//         math: (props) =>
//           <MathJax.Node>{props.value}</MathJax.Node>,
//         inlineMath: (props) =>
//           <MathJax.Node inline>{props.value}</MathJax.Node>,
//       }
//     };
//     return (
//       <MathJax.Context input="tex">
//         <ReactMarkdown {...newProps} />
//       </MathJax.Context>
//     );
//   };