import React, {Component} from 'react'
import { fetchArticles } from '../articles';

class ArticleFinder extends Component{
    constructor(props) {
        super(props)
        this.state = {
            articles: [],
            searchText: '',
            articleLength: Math.floor(Math.pow(window.innerWidth,1.5)/35)
        }

        this._isMounted = false;
    }
    
    //update article length when screensize changes
    handleResize () {
        const newLength = Math.floor(Math.pow(window.innerWidth,1.5)/35)
        this.setState({articleLength: newLength})
    }

    //close form when escape key is pressed
    handleKeypress(e) {
        if(e.key === 'Escape') this.props.closeFinder()
    }

    //fetch articles from server whenever search text changes
    async updateArticles () {
        const newArticles = await fetchArticles(this.state.searchText) 
        if(this._isMounted) this.setState({articles: newArticles})
    }

    //add event listeners for keydown and resize, initial fetch of articles
    componentDidMount() {
        this._isMounted=true
        window.addEventListener('resize', this.handleResize)
        window.addEventListener('keydown', this.handleKeypress)
        this.updateArticles()
    }
    
    // update articles when searchText changes
    componentDidUpdate(prevProps, prevState) {
        if(this.state.searchText === prevState.searchText) {
            return
        } else {
            this.updateArticles()
        }
    }

    // remove event listeners when component unmounts and avoid setting state when component is unmounted
    componentWillUnmount() {
        this._isMounted= false
        window.removeEventListener('resize', this.handleResize)
        window.removeEventListener('keydown', this.handleKeypress)
    }


    //handle search text input change
    handleInputChange(e) {
        this.setState({ searchText: e.target.value })
    }

    render () {
        return (
            <div>
                <h1>Article Finder</h1>
                <h5 
                    style={{color: 'red'}}>
                    Press Escape At Any Time To Close Article Finder
                </h5>
                <h3>
                    Find me articles about 
                    <input 
                        type='text' 
                        value={this.state.searchText} 
                        onChange={this.handleInputChange}/>
                </h3>
                {this.state.articles.map((article, index) => {
                    return (
                        <article key={'article-' + index}>
                            <h1>{article.title}</h1>
                            <p>{article.body.slice(0, this.state.articleLength) + ' ...'}</p>
                        </article>
                    )
                }
                )}
            </div>
        )
    }
   
}

export default ArticleFinder;

















//don't forget to bind functions
        // this.handleInputChange = this.handleInputChange.bind(this)
        // this.handleResize = this.handleResize.bind(this)
        // this.handleKeypress = this.handleKeypress.bind(this)