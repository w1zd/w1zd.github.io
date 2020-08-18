import React from "react"
import tocbot from "tocbot"
import { useEffect, useState } from "react"

const Toc = () => {

  const [collapseDepth, setCollapseDepth] = useState(1);
  const [toggleBtnText, setToggleBtnText] = useState('Expand all');

  const goTop = () => {
    window.scrollTo(0, 0)
  }
  
  const goBottom = () => {
    window.scrollTo(0, document.body.scrollHeight)
  }

  const toggleToc = () => {
    if(collapseDepth == 1){
      setCollapseDepth(6)
      setToggleBtnText('Collapse All')    
    }else{
      setCollapseDepth(1)
      setToggleBtnText('Expand All') 
    }
  }

  useEffect(() => {
    tocbot.init({
      tocSelector: ".tocbot-list",
      contentSelector: ".post-content",
      headingSelector: "h1, h2, h3, h4, h5",
      collapseDepth: collapseDepth,
      orderedList: false,
      scrollSmooth: true,
    })
  }, [collapseDepth])

  useEffect(() => {
    tocbot.init({
      tocSelector: ".tocbot-list",
      contentSelector: ".post-content",
      headingSelector: "h1, h2, h3, h4, h5",
      collapseDepth: 1,
      orderedList: false,
      scrollSmooth: true,
    })
  }, [])



  return (
    <div className="post-toc">
      <div className="tocbot-list"></div>
      <div className="tocbot-list-menu">
        <a className="tocbot-toc-expand" onClick={toggleToc}>
          {toggleBtnText}
        </a>
        <a onClick={goTop}>Back to top</a>
        <a onClick={goBottom}>Go to bottom</a>
      </div>
    </div>
  )
}

export default Toc
