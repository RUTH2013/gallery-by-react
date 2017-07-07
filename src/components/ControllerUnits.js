import React from 'react';

// controllerUnits 组件
class ControllerUnits extends React.Component {
	handleClick(e) {
		e.stopPropagation();
		e.preventDefault();
		if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

	};
	render() {
		let controllerUnitsClassName = "controller-unit";
		// 如果对应的是居中图片，显示控制按钮的居中态
		if (this.props.arrange.isCenter) {
      controllerUnitsClassName += " is-center";
      // 如果对应的是翻转图片，显示控制按钮的翻转态
      if (this.props.arrange.isInverse) {
      	controllerUnitsClassName += " is-inverse";
      }
    }
		return (
			<span className={controllerUnitsClassName}  onClick={this.handleClick.bind(this)}></span>

		);
	}

}
export default ControllerUnits;