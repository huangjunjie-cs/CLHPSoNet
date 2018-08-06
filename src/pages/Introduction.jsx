import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
// import { InlineMath, BlockMath } from 'react-katex';
import './css/md.css';
import 'katex/dist/katex.min.css';

const intro_md = `

## Introduction


As we all know, microscopes can help bioscientists better observe the internal structure of cells. Our framework hopes to help researchers not only focus on the relationships of specific research characters but recognize the role of these characters in the entire large social network, which we hope it works like computing lens for some social problems.

![framework](https://raw.githubusercontent.com/h12345jack/CLSRHF/thesis/imgs/framework.png)

## Related Work


###  Historical Figures’ Relationship
The study of social relationships between historical figures plays an important role in the study of history. In addition to a richer account of the life experiences of the characters, it also reflects the historical background of the historical figures to some extent. It attracted a lot of research interest. 


### Signed graphs
Signed graphs were primarily introduced in Psychology, with the objective of describing the relationships between people belonging to distinct social groups.

#### Structural Balance

![image](http://wx3.sinaimg.cn/large/006C73MUly1fqtn6jhcapj30o007ewfg.jpg)

#### Balance Theorem
> If a labeled complete graph is balanced, then either all pairs of nodes are friends, or else the nodes can be divided into two groups, X and Y , such that every pair of nodes in X like each other, every pair of nodes in Y like each other, and everyone in X is the enemy of everyone in Y .

#### A Weaker Form of Structural Balance
![image](http://wx3.sinaimg.cn/large/006C73MUly1fqtn9nve9pj30o0078dgq.jpg)

##### Characterization of Weakly Balanced Networks
>  If a labeled complete graph is weakly balanced, then its nodes can be divided into groups in such a way that every two nodes belonging to the same group are friends, and every two nodes belonging to different groups are enemies.

#### Graph Partition

Researchers defined clustering problems on signed graphs can be used as a criteria to measure the degree of balance in social networks. [15]. Then it becomes a cluster problem and it’s NP-hard, a lot of heuristic methods are proposed to solve the clustering problems [13], [15]–[17]. Recently, with the development of network representation learning, researchers begin to use machine learning methods to learn low-dimensional vector representations for nodes of a given network. And it has been proven to be useful in many tasks of network analysis such as link prediction, node classification, and visualization. 

### [CBDB Database](https://projects.iq.harvard.edu/cbdb)

The China Biographical Database(CBDB)4 [5] is a freely accessible relational database with biographical information about approximately 417,000 individuals, primarily from the 7th through 19th centuries. It is developed by Harvard University, Institute of History and Philology of Academia Sinica and Peking University. And recent CBDB’s version release in April 2017. The data is meant to be useful for statistical, social network, and spatial analysis as well as serving as a kind of biographical reference.
 
`


class Introduction extends Component {

    render() {
        return <div className="markdown-body"> 
            <ReactMarkdown source={intro_md} escapeHtml={false}/>
        </div>

    }
}

export default Introduction;
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