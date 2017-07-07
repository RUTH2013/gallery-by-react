require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import ImgFigure from './ImgFigure'; 
import ControllerUnits from './ControllerUnits';


// 获取图片相关信息
let imageDatas = require('../sources/imageDatas.json');
imageDatas = (function getImageURL(imageDatasArr) {
	for (let i = 0; i < imageDatasArr.length; i++) {
		let singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require(`../images/${singleImageData.fileName}`);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

/*
* 获取区间内的一个随机值
*/
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

/*
* 获取0-30度之间的一个任意正负值
*/
function get30DegRandom() {
	return ((Math.random() > 0.5 ? '': '-') + Math.ceil(Math.random() * 30));
}





class AppComponent extends React.Component {
	
	/* 重新布局所有图片
	 * @param centerIndex 指定居中排布哪个图片
	*/
	rearrange(centerIndex) { // 
		let imgsArrangeArr = this.state.imgsArrangeArr,
				Constant = this.Constant,
				centerPos = Constant.centerPos,
				hPosRange = Constant.hPosRange,
				vPosRange = Constant.vPosRange,
				hPosRangeLeftSecX = hPosRange.leftSecX,
				hPosRangeRightSecX = hPosRange.rightSecX,
				hPosRangeY = hPosRange.y,
				vPosRangeTopY = vPosRange.topY,
				vPosRangeX = vPosRange.x,

				imgsArrangeTopArr = [],
				topImgNum = Math.floor(Math.random() * 2) , // 娶一个或者不取
				topImgSpliceIndex = 0,
				imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
		// 居中centerIndex的图片,不需要旋转
		imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    }

		 // 取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

		// 布局位于上侧的图片
		imgsArrangeTopArr.forEach((value, index)=>{
			imgsArrangeTopArr[index] = {
				pos: {
					top: getRangeRandom( vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom( vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
		}); 

		// 布局左右两侧的图片
		for (let i = 0, j= imgsArrangeArr.length, k = j / 2; i<j; i++) {
			let hPosRangeLoRX = null;
			// 前半部分在左边，右半部分布局在右边
			if (i<k) {
				hPosRangeLoRX = hPosRangeLeftSecX;
			} else{
				hPosRangeLoRX = hPosRangeRightSecX;
			}
			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom( hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom( hPosRangeLoRX[0], hPosRangeLoRX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
		}
		// 将先前取出的 上侧的图片再放回到imgsArrangeArr中
		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
		console.log(imgsArrangeArr);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		})
	};
	/*
	* 翻转图片
	* @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index 值
	* @return {Function} 这是一个闭包函数， 其内return一个真正待被执行的函数
	*/
	inverse(index) {
		return ()=> {
			let imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}
	};
	/*
   * 当非居中的图片被点击时，利用rearrange函数，居中对应index的图片
   * @param index，需要被居中的图片信息数组中的index值
   * @return {function} (return一个闭包函数)
   */
  center (index) {
    return ()=> {
      this.rearrange(index)
    }
  };
	constructor(props) {
		super(props);
		this.state = {
			imgsArrangeArr: [
				/*{
					pos: {
						left: '0',
						top: '0'
					},
					rotate: 0,   // 图片的旋转角度
					isInverse: false   // 设置图片是否翻转的状态
					isCenter: false   // 默认图片不居中
				}*/
			]
		};
		this.Constant = {
			centerPos: {
				left: 0,
				right: 0
			},
			hPosRange: {  // 水平方向的取值范围
				leftSecX: [0,0],
				rightSecX : [0,0],
				y: [0,0]
			},
			vPosRange: {  // 垂直方向的取值范围
				x: [0,0],
				topY: [0,0]
			}
		};
	};
	componentDidMount() { // 在组件加载完，为每张图片计算其位置范围
		// 取到stage的大小
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
				stageW = stageDOM.scrollWidth,
				stageH = stageDOM.scrollHeight,
				halfStageW = Math.ceil(stageW/2),
				halfStageH = Math.ceil(stageH/2);
		
		// 取到imgFigure的大小
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
				imgW = imgFigureDOM.scrollWidth,
				imgH = imgFigureDOM.scrollHeight,
				halfImgW = Math.ceil(imgW/2),
				halfImgH = Math.ceil(imgH/2);

		// 计算中心图片位置
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};

		// 计算左侧 右侧区域图片位置范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW -halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH -halfImgH;

		// 计算上侧区域图片位置范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW ;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);

	};
  render() {
  	let controllerUnits = [];
  	let imgFigures = [];
  	imageDatas.forEach((item, index)=> {
  		if (!this.state.imgsArrangeArr[index]) {
  			this.state.imgsArrangeArr[index] = {
  				pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
  			}
  		}
  		imgFigures.push(
  			<ImgFigure 
  			  key={index}
  				data={item} 
  				ref={'imgFigure'+ index} 
  				arrange={this.state.imgsArrangeArr[index]}
  				inverse={this.inverse(index)}
  				center={this.center(index)}
  			/>
  		);
  		controllerUnits.push(
  			<ControllerUnits
  				key={index}
  				arrange={this.state.imgsArrangeArr[index]}
  				inverse={this.inverse(index)}
  				center={this.center(index)}
  			/>
  		);
  	});

    return (
    	<section className="stage" ref="stage">
    		<section className="img-sec">
    			{imgFigures}
    		</section>
    		<nav className="controller-nav">
    			{controllerUnits}
    		</nav>
    	</section>	
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
