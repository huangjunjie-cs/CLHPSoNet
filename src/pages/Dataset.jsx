import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
// import { InlineMath, BlockMath } from 'react-katex';
import './css/md.css';
import 'katex/dist/katex.min.css';
const intro_md = `
## Dataset

input the people you want to analysis


`
class Dataset extends Component {

    render() {
        return <div className="markdown-body">  
            <ReactMarkdown source={intro_md} escapeHtml={false}/>
        </div>

    }
}
export default Dataset;