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
// import buildingData from '../../../res/test_school.json';
import timeData from '../../peopleTraffic/udsu_b1_L4_v2_190701_mv_csv.json';
import { View } from '../../BuildingView2D/application/view/View';
import { Point as PixiPoint } from 'pixi.js';
import { Point } from '../../BuildingView2D/application/Interfaces/Building';
import { Logic } from '../../BuildingView2D/application/logic/Logic';
import {
	decrementCurrentLevel,
	decrementScale,
	incrementCurrentLevel,
	incrementScale,
	setScale
} from '../../store/slices/BuildingViewSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { store } from '../../store';
import cn from 'classnames';
import styles from './ModelingViewPage.module.css';
import FloorInfo from '../../components/modeling/FloorInfo';
import ControlPanel from '../../components/modeling/ControlPanel';
import { TimeData } from '../../BuildingView2D/application/Interfaces/TimeData';

const ModelingViewPage = () => {
	const evacuationTimeData = timeData as TimeData;
	const { currentLevel, scale } = useAppSelector(state => state.buildingViewReducer);
	const dispatch = useAppDispatch();
	const [canMove, setCanMove] = useState<boolean>(false);
	const [anchorCoordinates, setAnchorCoordinates] = useState<PixiPoint>(
		new PixiPoint(0, 0)
	);
	const [peopleCoordinates, setPeopleCoordinates] = useState<Point[]>(
		Logic.generatePeopleCoordinates(
			buildingData.Level[currentLevel],
			evacuationTimeData.items
		)
	);

	useEffect(() => {
		dispatch(setScale(8));
		window.addEventListener('keydown', handleWindowKeydown);
		return () => {
			window.removeEventListener('keydown', handleWindowKeydown);
		};
	}, [dispatch]);

	const draw = useCallback(
		(g: PixiGraphics) => {
			g.clear();
			View.drawBuildingRoomsPixi(g, buildingData.Level[currentLevel].BuildElement);
			View.drawPeople(g, peopleCoordinates);
		},
		[currentLevel, peopleCoordinates]
	);

	const handleCanvasWheel: WheelEventHandler<HTMLCanvasElement> = event => {
		switch (Math.sign(event.deltaY)) {
			case -1:
				dispatch(incrementScale());
				break;
			case +1:
				dispatch(decrementScale());
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
			setAnchorCoordinates(
				p => new PixiPoint(p.x + event.movementX, p.y + event.movementY)
			);
		}
	};

	const handleWindowKeydown = (event: KeyboardEvent) => {
		const {
			buildingViewReducer: { currentLevel }
		} = store.getState();
		switch (event.key) {
			case 'ArrowUp':
				if (currentLevel < buildingData.Level.length - 1) {
					dispatch(incrementCurrentLevel());
					const {
						buildingViewReducer: { currentLevel: updatedLevel }
					} = store.getState();
					setPeopleCoordinates(
						Logic.generatePeopleCoordinates(
							buildingData.Level[updatedLevel],
							evacuationTimeData.items
						)
					);
				}
				break;
			case 'ArrowDown':
				if (currentLevel > 0) {
					dispatch(decrementCurrentLevel());
					const {
						buildingViewReducer: { currentLevel: updatedLevel }
					} = store.getState();
					setPeopleCoordinates(
						Logic.generatePeopleCoordinates(
							buildingData.Level[updatedLevel],
							evacuationTimeData.items
						)
					);
				}
				break;
			case '=':
			case '+':
				dispatch(incrementScale());
				break;
			case '-':
			case '_':
				dispatch(decrementScale());
				break;
		}
	};

	return (
		<main className={cn(styles.container, 'text-sm font-medium text-white')}>
			<FloorInfo />
			<div className="w-full h-full overflow-hidden">
				<Stage
					id="canvas"
					width={window.innerWidth}
					height={window.innerHeight}
					options={{ backgroundColor: 0xffffff, antialias: true }}
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
			</div>
			<ControlPanel
				onPlayButtonClick={() => {}}
				onPauseButtonClick={() => {}}
				onSpeedUpButtonClick={() => {}}
				onSpeedDownButtonClick={() => {}}
			/>
		</main>
	);
};

export default ModelingViewPage;
