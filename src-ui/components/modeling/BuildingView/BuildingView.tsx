import React, { FC, MouseEventHandler, useEffect, WheelEventHandler } from 'react';

interface BuildingViewProps {
	onMount: () => void;
	onUnmount: () => void;
	onCanvasDoubleClick: MouseEventHandler<HTMLCanvasElement>;
	onCanvasWheel: WheelEventHandler<HTMLCanvasElement>;
	onCanvasMouseDown: MouseEventHandler<HTMLCanvasElement>;
	onCanvasMouseUp: MouseEventHandler<HTMLCanvasElement>;
	onCanvasMouseOut: MouseEventHandler<HTMLCanvasElement>;
	onCanvasMouseMove: MouseEventHandler<HTMLCanvasElement>;
}

const BuildingView: FC<BuildingViewProps> = ({
	onMount,
	onUnmount,
	onCanvasDoubleClick,
	onCanvasWheel,
	onCanvasMouseDown,
	onCanvasMouseUp,
	onCanvasMouseOut,
	onCanvasMouseMove
}) => {
	useEffect(() => {
		onMount();
		return onUnmount;
	}, []);

	return (
		<section>
			<div className="w-full h-full" id="canvas_container">
				<canvas
					id="field"
					onDoubleClick={onCanvasDoubleClick}
					onWheel={onCanvasWheel}
					onMouseDown={onCanvasMouseDown}
					onMouseUp={onCanvasMouseUp}
					onMouseOut={onCanvasMouseOut}
					onMouseMove={onCanvasMouseMove}
				></canvas>
			</div>
		</section>
	);
};

export default BuildingView;
