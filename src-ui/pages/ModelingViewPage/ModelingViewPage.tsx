import React, {
	MouseEventHandler,
	useCallback,
	useEffect,
	useState,
	WheelEventHandler
} from 'react';
import { Container, Graphics, Stage } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import buildingData from '../../peopleTraffic/udsu_b1_L4_v2_190701.json';
import { View } from '../../BuildingView2D/application/view/View';
import { Point } from 'pixi.js';

const ModelingViewPage = () => {
	const [scale, setScale] = useState<number>(5);
	const [canMove, setCanMove] = useState<boolean>(false);
	const [anchorCoordinates, setAnchorCoordiantes] = useState<Point>(new Point(0, 0));

	useEffect(() => {
		console.log('render');
	}, []);

	const draw = useCallback((g: PixiGraphics) => {
		g.clear();
		// g.beginFill(0xff3300);
		// g.lineStyle(4, 0xffd900, 1);
		// g.moveTo(50, 50);
		// g.lineTo(250, 50);
		// g.lineTo(100, 100);
		// g.lineTo(50, 50);
		// g.endFill();
		// g.lineStyle(2, 0x0000ff, 1);
		// g.beginFill(0xff700b, 1);
		// g.drawRect(50, 150, 120, 120);
		// g.lineStyle(2, 0xff00ff, 1);
		// g.beginFill(0xff00bb, 0.25);
		// g.drawRoundedRect(150, 100, 300, 100, 15);
		// g.endFill();
		// g.lineStyle(0);
		// g.beginFill(0xffff0b, 0.5);
		// g.drawCircle(470, 90, 60);
		// g.endFill();
		View.drawBuildingRoomsPixi(g, buildingData.Level[0].BuildElement);
	}, []);

	const handleCanvasWheel: WheelEventHandler<HTMLCanvasElement> = event => {
		switch (Math.sign(event.deltaY)) {
			case -1:
				setScale(x => x + 0.1);
				break;
			case +1:
				setScale(x => x - 0.1);
				break;
		}
	};

	const handleCanvasMouseDown: MouseEventHandler<HTMLCanvasElement> = _ => {
		setCanMove(true);
	};

	const handleCanvasMouseUp: MouseEventHandler<HTMLCanvasElement> = _ => {
		setCanMove(false);
	};

	const handleCanvasMouseOut: MouseEventHandler<HTMLCanvasElement> = _ => {
		setCanMove(false);
	};

	const handleCanvasMouseMove: MouseEventHandler<HTMLCanvasElement> = event => {
		if (canMove) {
			setAnchorCoordiantes(p => new Point(p.x + event.movementX, p.y + event.movementY));
		}
	};

	return (
		<Stage
			id="canvas"
			options={{ backgroundColor: 0xffffff }}
			onWheel={handleCanvasWheel}
			onMouseMove={handleCanvasMouseMove}
			onMouseDown={handleCanvasMouseDown}
			onMouseUp={handleCanvasMouseUp}
			onMouseOut={handleCanvasMouseOut}
		>
			<Container scale={scale} x={anchorCoordinates.x} y={anchorCoordinates.y}>
				<Graphics draw={draw} />
			</Container>
		</Stage>
	);
};

export default ModelingViewPage;
