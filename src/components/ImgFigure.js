import React from 'react';

// 图片的 component
class ImgFigure extends React.Component {
	// 点击处理函数
	handleClick(e) {
		console.log('1111');
		e.stopPropagation();
		e.preventDefault();
		if (this.props.arrange.isCenter) {
      // 调用父组件的函数
      this.props.inverse();
    } else {
      this.props.center();
    }

	};


  render() {
  	let styleObj = {};
  	// 如果props中指定了 这张图片的位置，则使用
  	if(this.props.arrange.pos){
  		styleObj = this.props.arrange.pos;
  	}
  	// 如果图片旋转角度有值并不为0，添加旋转角度
  	if (this.props.arrange.rotate) {
      ['MozTransform', 'msTransform', 'WebkitTransform', 'OTransform', 'transform'].map((item) => {
        styleObj[item] =`rotate(${this.props.arrange.rotate}deg)`;
      })
    }
     /*
     * 居中图片z-index高于旁边的图片，低于controller-nav的。取11的一次方
     */
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }
  	let imgFigureClassName = 'img-figure';
  	imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse':'';
  	console.log(imgFigureClassName);

    return (
    	<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
    		<div className="front">
    			<img src={this.props.data.imageURL} alt={this.props.data.title}/>
    			<h2 className="img-title">{this.props.data.title}</h2>
    		</div>	
    		<div className="img-back" onClick={this.handleClick.bind(this)}>
    			<p>{this.props.data.description}</p>
    		</div>	
  
    	</figure>	
    );
  }
}

export default ImgFigure;